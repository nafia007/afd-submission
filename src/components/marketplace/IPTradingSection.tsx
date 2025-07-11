import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, DollarSign, Users, Lock } from "lucide-react";
import { Link } from "react-router-dom";
interface IPToken {
  filmId: string;
  filmTitle: string;
  tokenPrice: number;
  totalSupply: number;
  circulating: number;
  marketCap: number;
  dayChange: number;
  volume24h: number;
  stakingAPR: number;
  revenueYield: number;
}
const IPTradingSection = () => {
  const ipTokens: IPToken[] = [{
    filmId: "1",
    filmTitle: "Neon Dreams",
    tokenPrice: 12.45,
    totalSupply: 100000,
    circulating: 84580,
    marketCap: 1245000,
    dayChange: 8.7,
    volume24h: 45600,
    stakingAPR: 18.5,
    revenueYield: 12.3
  }, {
    filmId: "2",
    filmTitle: "Urban Legends",
    tokenPrice: 18.20,
    totalSupply: 75000,
    circulating: 66070,
    marketCap: 1365000,
    dayChange: -2.4,
    volume24h: 67800,
    stakingAPR: 22.3,
    revenueYield: 15.7
  }, {
    filmId: "3",
    filmTitle: "The Last Garden",
    tokenPrice: 24.80,
    totalSupply: 50000,
    circulating: 44800,
    marketCap: 1240000,
    dayChange: 5.1,
    volume24h: 32400,
    stakingAPR: 15.7,
    revenueYield: 9.8
  }];
  return;
};
export default IPTradingSection;