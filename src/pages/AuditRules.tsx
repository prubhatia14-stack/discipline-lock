import { DashboardLayout } from "@/components/DashboardLayout";
import { Shield, Eye, Camera, Clock, AlertTriangle, CheckCircle2, Zap } from "lucide-react";

export default function AuditRules() {
  const auditTypes = [
    {
      icon: Camera,
      title: "Photo Verification",
      description: "You may be asked to take a real-time selfie or gym photo to prove you're working out.",
    },
    {
      icon: Clock,
      title: "Time-Based Checks",
      description: "Our AI verifies the timestamp and metadata to ensure logs are genuine and not backdated.",
    },
    {
      icon: Eye,
      title: "Consistency Analysis",
      description: "Patterns are analyzed to detect anomalies in logging behavior that suggest dishonest entries.",
    },
    {
      icon: Zap,
      title: "Random Spot Checks",
      description: "Audits can trigger at any time during your challenge to keep accountability high.",
    },
  ];

  const consequences = [
    {
      icon: AlertTriangle,
      title: "Failed Audit",
      description: "If you fail an audit, your entire challenge is terminated and your remaining stake is forfeited.",
      severity: "destructive" as const,
    },
    {
      icon: CheckCircle2,
      title: "Passed Audit",
      description: "Successfully passing an audit confirms your workout and you continue your challenge as normal.",
      severity: "success" as const,
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 border-2 border-border flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold uppercase">Audit System</h1>
            <p className="text-sm text-muted-foreground">How we ensure honest accountability</p>
          </div>
        </div>

        {/* Intro */}
        <div className="border-2 border-border p-4 mb-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Lockit uses an AI-powered audit system to verify workouts and maintain the integrity of challenges. 
            Audits are designed to be quick but effective—ensuring everyone plays fair while keeping your 
            stake meaningful.
          </p>
        </div>

        {/* Audit Types */}
        <div className="mb-8">
          <h2 className="font-bold uppercase mb-4 text-sm text-muted-foreground">What We Track</h2>
          <div className="space-y-3">
            {auditTypes.map((type, i) => (
              <div key={i} className="border-2 border-border p-4 flex items-start gap-4">
                <div className="w-10 h-10 border-2 border-border flex items-center justify-center flex-shrink-0">
                  <type.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">{type.title}</h3>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Consequences */}
        <div className="mb-8">
          <h2 className="font-bold uppercase mb-4 text-sm text-muted-foreground">Audit Outcomes</h2>
          <div className="space-y-3">
            {consequences.map((item, i) => (
              <div 
                key={i} 
                className={`border-2 p-4 flex items-start gap-4 ${
                  item.severity === 'destructive' 
                    ? 'border-destructive/50 bg-destructive/5' 
                    : 'border-green-500/50 bg-green-500/5'
                }`}
              >
                <div className={`w-10 h-10 border-2 flex items-center justify-center flex-shrink-0 ${
                  item.severity === 'destructive' 
                    ? 'border-destructive text-destructive' 
                    : 'border-green-500 text-green-500'
                }`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="border-2 border-border p-4">
          <h2 className="font-bold uppercase mb-4">How Audits Work</h2>
          <ol className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 border-2 border-border flex items-center justify-center flex-shrink-0 text-sm font-bold">1</span>
              <div>
                <p className="font-medium">Audit Triggered</p>
                <p className="text-sm text-muted-foreground">When you log a workout, an audit may be randomly triggered.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 border-2 border-border flex items-center justify-center flex-shrink-0 text-sm font-bold">2</span>
              <div>
                <p className="font-medium">Verification Code</p>
                <p className="text-sm text-muted-foreground">You'll receive a unique code to include in your proof photo.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 border-2 border-border flex items-center justify-center flex-shrink-0 text-sm font-bold">3</span>
              <div>
                <p className="font-medium">Submit Proof</p>
                <p className="text-sm text-muted-foreground">Take a photo at your workout location showing the code.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 border-2 border-border flex items-center justify-center flex-shrink-0 text-sm font-bold">4</span>
              <div>
                <p className="font-medium">AI Verification</p>
                <p className="text-sm text-muted-foreground">Our AI analyzes the photo for authenticity and validity.</p>
              </div>
            </li>
          </ol>
        </div>

        {/* Note */}
        <div className="mt-6 p-4 border-2 border-dashed border-muted-foreground/30">
          <p className="text-xs text-muted-foreground text-center">
            Audits are designed to be fair but firm. The goal is to keep you honest, not to trick you. 
            If you're genuinely working out, you have nothing to worry about.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
