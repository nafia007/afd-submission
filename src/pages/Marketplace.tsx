import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { getFilmMinterContract } from "@/integrations/contracts/filmNFT"
import { ethers } from "ethers"
import { Film } from "@/types/film"
import { useFilms } from "@/hooks/useFilms"
import MarketplaceHeader from "@/components/marketplace/MarketplaceHeader"
import SearchBar from "@/components/marketplace/SearchBar"
import MarketplaceTabs from "@/components/marketplace/MarketplaceTabs"
import FilmFilters, { FilterState } from "@/components/marketplace/FilmFilters"
import FilmSubmissionForm from "@/components/FilmSubmissionForm"

interface Profile {
  id: string
  role: 'admin' | 'user'
}

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<FilterState>({})
  const [showSubmissionForm, setShowSubmissionForm] = useState(false)
  const [userProfile, setUserProfile] = useState<Profile | null>(null)
  const navigate = useNavigate()
  const { data: films, isLoading, refetch } = useFilms()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      if (sessionData.session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, role')
          .eq('id', sessionData.session.user.id)
          .single()
        
        if (profile) {
          setUserProfile(profile)
        }
      }
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, role')
          .eq('id', session.user.id)
          .single()
        
        if (profile) {
          setUserProfile(profile)
        }
      } else {
        setUserProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleMint = async (film: Film) => {
    try {
      if (!window.ethereum) {
        toast.error("Please install a Web3 wallet like MetaMask")
        return
      }

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = getFilmMinterContract(signer)
      
      const priceInWei = ethers.parseEther(film.price)
      
      toast.info("Please confirm the transaction in your wallet")
      
      // Use the new minter contract function
      const tx = await contract.mintWithPrice(
        await signer.getAddress(),
        film.token_id || Math.floor(Math.random() * 1000000),
        film.film_url,
        priceInWei,
        { value: priceInWei }
      )
      
      toast.loading("Minting your NFT...", {
        description: "Please wait while the transaction is being processed"
      })
      
      await tx.wait()
      
      toast.success("NFT minted successfully!", {
        description: "You now own the IP rights to this film"
      })
    } catch (error) {
      console.error("Minting error:", error)
      toast.error("Failed to mint NFT", {
        description: error instanceof Error ? error.message : "Please try again later"
      })
    }
  }

  const handleDelete = async (filmId: string) => {
    try {
      const { error } = await supabase
        .from('films')
        .delete()
        .eq('id', filmId)

      if (error) throw error

      toast.success("Film deleted successfully")
      refetch()
    } catch (error) {
      toast.error("Failed to delete film", {
        description: error instanceof Error ? error.message : "Please try again later"
      })
    }
  }

  const handleSubmitClick = async () => {
    const { data: sessionData } = await supabase.auth.getSession()
    if (!sessionData.session) {
      toast.error("Authentication required", {
        description: "Please log in to submit a film",
      })
      navigate('/login')
      return
    }
    setShowSubmissionForm(!showSubmissionForm)
  }

  const applyFilters = (filmList: Film[]) => {
    return filmList.filter(film => {
      // Search term filter
      const matchesSearch = !searchTerm || 
        film.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        film.description?.toLowerCase().includes(searchTerm.toLowerCase())

      // Genre filter
      const matchesGenre = !filters.genre || film.genre === filters.genre

      // Completion status filter
      const matchesStatus = !filters.completionStatus || film.completion_status === filters.completionStatus

      // Price filter
      const filmPrice = parseFloat(film.price)
      const matchesPriceMin = !filters.priceMin || filmPrice >= filters.priceMin
      const matchesPriceMax = !filters.priceMax || filmPrice <= filters.priceMax

      // Budget filter
      const filmBudget = film.budget ? parseFloat(film.budget) : 0
      const matchesBudgetMin = !filters.budgetMin || filmBudget >= filters.budgetMin
      const matchesBudgetMax = !filters.budgetMax || filmBudget <= filters.budgetMax

      return matchesSearch && matchesGenre && matchesStatus && 
             matchesPriceMin && matchesPriceMax && matchesBudgetMin && matchesBudgetMax
    })
  }

  const filteredFilms = films ? applyFilters(films) : []

  return (
    <div className="container mx-auto px-4 pt-32 pb-16">
      <div className="flex flex-col gap-8">
        <MarketplaceHeader
          onSubmitClick={handleSubmitClick}
          showSubmissionForm={showSubmissionForm}
          userProfile={userProfile}
        />

        {showSubmissionForm && userProfile && (
          <div className="bg-card border rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-heading font-bold mb-6">Submit Your Film</h2>
            <FilmSubmissionForm onSuccess={() => refetch()} />
          </div>
        )}

        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <FilmFilters onFiltersChange={setFilters} />

        <MarketplaceTabs
          films={filteredFilms}
          isLoading={isLoading}
          onMint={handleMint}
          onDelete={handleDelete}
          userProfile={userProfile}
        />
      </div>
    </div>
  )
}

export default Marketplace
