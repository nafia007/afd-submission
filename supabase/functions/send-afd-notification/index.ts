import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AFDNotificationRequest {
  userEmail: string;
  title: string;
  director: string;
  tier: string;
  description: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userEmail, title, director, tier, description }: AFDNotificationRequest = await req.json();

    // Send confirmation email to user
    const userEmailResponse = await resend.emails.send({
      from: "AFD Submissions <onboarding@resend.dev>",
      to: [userEmail],
      subject: "AFD Submission Received - " + title,
      html: `
        <h1>Thank you for your AFD submission!</h1>
        <p>We have successfully received your project submission:</p>
        <ul>
          <li><strong>Title:</strong> ${title}</li>
          <li><strong>Director:</strong> ${director}</li>
          <li><strong>Tier:</strong> ${tier}</li>
        </ul>
        <p><strong>Description:</strong> ${description}</p>
        <p>We will review your submission and get back to you soon.</p>
        <p>Best regards,<br>The AFD Team</p>
      `,
    });

    // Send notification email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "AFD Submissions <onboarding@resend.dev>",
      to: ["admin@yourdomain.com"], // Replace with actual admin email
      subject: "New AFD Submission - " + title,
      html: `
        <h1>New AFD Submission Received</h1>
        <p>A new project has been submitted to AFD:</p>
        <ul>
          <li><strong>Title:</strong> ${title}</li>
          <li><strong>Director:</strong> ${director}</li>
          <li><strong>Tier:</strong> ${tier}</li>
          <li><strong>User Email:</strong> ${userEmail}</li>
        </ul>
        <p><strong>Description:</strong> ${description}</p>
        <p>Please review the submission in the admin panel.</p>
      `,
    });

    console.log("Emails sent successfully:", { userEmailResponse, adminEmailResponse });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-afd-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);