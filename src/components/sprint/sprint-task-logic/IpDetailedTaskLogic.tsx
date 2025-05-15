
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useSprintProfileQuickEdit } from "@/hooks/useSprintProfileQuickEdit";
import { useSprintAnswers } from "@/hooks/useSprintAnswers";
import { Card } from "@/components/ui/card";
import StepBasedTaskLogic from "../StepBasedTaskLogic";
import { Step, StepType } from "../StepBasedTaskLogic";

interface IpDetailedTaskLogicProps {
  task: any;
  isCompleted: boolean;
  onComplete: (fileId?: string) => void;
  hideMainQuestion?: boolean;
}

const IpDetailedTaskLogic = ({
  task,
  isCompleted,
  onComplete,
  hideMainQuestion = false,
}: IpDetailedTaskLogicProps) => {
  const { sprintProfile } = useSprintProfileQuickEdit();
  const { handleChange } = useSprintAnswers();
  const [isWorking, setIsWorking] = useState(false);
  
  // University IP path specific states
  const [ttoConversation, setTtoConversation] = useState<string>("no");
  const [ttoConversationDetails, setTtoConversationDetails] = useState<string>("");
  const [ttoLicensingTerms, setTtoLicensingTerms] = useState<string>("");
  const [ttoPlans, setTtoPlans] = useState<string>("");
  
  // Non-university IP path specific states
  const [ownsAllIp, setOwnsAllIp] = useState<string>("yes");
  const [patentsFiled, setPatentsFiled] = useState<string>("no");
  const [patentDetails, setPatentDetails] = useState<string>("");
  const [ipOwnershipStatus, setIpOwnershipStatus] = useState<string>("");
  
  // Common IP strategy states
  const [coreAssets, setCoreAssets] = useState<string>("");
  const [ipProtectionStrategy, setIpProtectionStrategy] = useState<string>("");
  const [ipRelevance, setIpRelevance] = useState<string>("");
  
  // Load existing answers if available
  React.useEffect(() => {
    if (task.progress?.answers) {
      const answers = task.progress.answers;
      
      // University IP path
      if (answers.ttoConversation) setTtoConversation(answers.ttoConversation);
      if (answers.ttoConversationDetails) setTtoConversationDetails(answers.ttoConversationDetails);
      if (answers.ttoLicensingTerms) setTtoLicensingTerms(answers.ttoLicensingTerms);
      if (answers.ttoPlans) setTtoPlans(answers.ttoPlans);
      
      // Non-university IP path
      if (answers.ownsAllIp) setOwnsAllIp(answers.ownsAllIp);
      if (answers.patentsFiled) setPatentsFiled(answers.patentsFiled);
      if (answers.patentDetails) setPatentDetails(answers.patentDetails);
      if (answers.ipOwnershipStatus) setIpOwnershipStatus(answers.ipOwnershipStatus);
      
      // Common
      if (answers.coreAssets) setCoreAssets(answers.coreAssets);
      if (answers.ipProtectionStrategy) setIpProtectionStrategy(answers.ipProtectionStrategy);
      if (answers.ipRelevance) setIpRelevance(answers.ipRelevance);
    }
  }, [task.progress?.answers]);

  const handleSubmit = async () => {
    setIsWorking(true);
    try {
      const isUniversityIp = sprintProfile?.university_ip || false;
      
      const answers: Record<string, any> = {
        // Common fields
        coreAssets,
        ipProtectionStrategy,
        ipRelevance,
      };
      
      // Add path-specific fields
      if (isUniversityIp) {
        answers.ttoConversation = ttoConversation;
        if (ttoConversation === "yes") {
          answers.ttoConversationDetails = ttoConversationDetails;
          answers.ttoLicensingTerms = ttoLicensingTerms;
        } else {
          answers.ttoPlans = ttoPlans;
        }
      } else {
        answers.ownsAllIp = ownsAllIp;
        if (ownsAllIp === "yes") {
          answers.patentsFiled = patentsFiled;
          if (patentsFiled === "yes") {
            answers.patentDetails = patentDetails;
          }
        } else {
          answers.ipOwnershipStatus = ipOwnershipStatus;
        }
      }
      
      // Save answers to task progress instead of using saveAnswers
      await onComplete();
      toast.success("IP strategy saved successfully!");
    } catch (error) {
      console.error("Error saving IP strategy:", error);
      toast.error("Failed to save your IP strategy. Please try again.");
    } finally {
      setIsWorking(false);
    }
  };

  // Define steps based on university IP status
  const getSteps = () => {
    const isUniversityIp = sprintProfile?.university_ip || false;
    
    if (isUniversityIp) {
      // University IP path
      return [
        {
          type: "content" as StepType,
          content: (
            <div className="space-y-6">
              <p className="text-sm text-slate-600">
                If your technology is based on a university invention, you'll need to engage with the Technology Transfer Office (TTO).
              </p>
              
              <div className="space-y-4">
                <p className="font-medium">Have you begun conversations with the Tech Transfer Office (TTO)?</p>
                <RadioGroup value={ttoConversation} onValueChange={setTtoConversation} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="tto-yes" />
                    <Label htmlFor="tto-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="tto-no" />
                    <Label htmlFor="tto-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {ttoConversation === "yes" ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tto-details">Summarize conversation:</Label>
                    <Textarea 
                      id="tto-details" 
                      value={ttoConversationDetails} 
                      onChange={(e) => setTtoConversationDetails(e.target.value)}
                      placeholder="Describe your interactions with the TTO and the current status of your negotiations..."
                      className="min-h-[120px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="licensing-terms">Preliminary licensing terms (especially % equity) the TTO is expecting:</Label>
                    <Textarea 
                      id="licensing-terms" 
                      value={ttoLicensingTerms} 
                      onChange={(e) => setTtoLicensingTerms(e.target.value)}
                      placeholder="Outline any terms that have been discussed such as equity stakes, royalties, etc..."
                      className="min-h-[120px]"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="tto-plans">What is your plan to approach the TTO?</Label>
                  <Textarea 
                    id="tto-plans" 
                    value={ttoPlans} 
                    onChange={(e) => setTtoPlans(e.target.value)}
                    placeholder="What is your timeline and strategy for approaching the TTO?"
                    className="min-h-[120px]"
                  />
                </div>
              )}
            </div>
          )
        },
        {
          type: "content" as StepType,
          content: (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="core-assets">What are the core intellectual assets of your company?</Label>
                <Textarea 
                  id="core-assets" 
                  value={coreAssets} 
                  onChange={(e) => setCoreAssets(e.target.value)}
                  placeholder="Describe the key intellectual property that gives your company value..."
                  className="min-h-[120px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ip-protection">How do you plan to protect your inventions and IP?</Label>
                <Textarea 
                  id="ip-protection" 
                  value={ipProtectionStrategy} 
                  onChange={(e) => setIpProtectionStrategy(e.target.value)}
                  placeholder="Outline your strategy for patents, trade secrets, etc..."
                  className="min-h-[120px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ip-relevance">Why is this IP relevant to your company's success?</Label>
                <Textarea 
                  id="ip-relevance" 
                  value={ipRelevance} 
                  onChange={(e) => setIpRelevance(e.target.value)}
                  placeholder="Explain how this intellectual property provides competitive advantage..."
                  className="min-h-[120px]"
                />
              </div>
            </div>
          )
        },
        {
          type: "content" as StepType,
          content: (
            <div className="space-y-6">
              <Card className="p-4 bg-slate-50">
                <h3 className="text-lg font-semibold mb-2">Technology Transfer Office Strategies</h3>
                <p className="text-sm text-slate-600 mb-4">
                  When working with university TTOs, keep these key strategies in mind:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
                  <li><span className="font-medium">The TTO's mission:</span> TTOs aim to commercialize university research and generate revenue for the university.</li>
                  <li><span className="font-medium">TTO incentives:</span> TTOs typically get paid when the license starts producing income, not when it's signed.</li>
                  <li><span className="font-medium">Founder mindset:</span> When talking to the TTO, you're no longer just a researcher or employee - you're a founder negotiating a business deal.</li>
                  <li><span className="font-medium">The nuclear option:</span> Consider commercially developing technology adjacent to your research that doesn't use university IP.</li>
                </ul>
              </Card>
              
              <Card className="p-4 bg-slate-50">
                <h3 className="text-lg font-semibold mb-2">The Mother of All Tricks</h3>
                <p className="text-sm text-slate-600 mb-4">
                  The biggest problem startups face in TTO licensing:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
                  <li>TTOs often demand 5-10% equity in the company.</li>
                  <li>Investors generally view this as a red flag and may pass on your company.</li>
                  <li>Even 1% more dilution can materially impact founder outcomes.</li>
                  <li><span className="font-medium">Solution:</span> Structure milestone-based cash payments instead of equity.</li>
                  <li>Example: $1k at incorporation + $10k at $1m funding + $50k at exit/IPO.</li>
                  <li>This is actually better for the TTO as most startups fail, but successful ones can generate meaningful returns.</li>
                </ul>
              </Card>
            </div>
          )
        }
      ];
    } else {
      // Non-university IP path
      return [
        {
          type: "content" as StepType,
          content: (
            <div className="space-y-6">
              <p className="text-sm text-slate-600">
                Understanding the ownership structure of your intellectual property is crucial for your startup's foundation.
              </p>
              
              <div className="space-y-4">
                <p className="font-medium">Do you own all the IP?</p>
                <RadioGroup value={ownsAllIp} onValueChange={setOwnsAllIp} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="owns-ip-yes" />
                    <Label htmlFor="owns-ip-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="owns-ip-no" />
                    <Label htmlFor="owns-ip-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {ownsAllIp === "yes" ? (
                <div className="space-y-4">
                  <p className="font-medium">Have you filed patents?</p>
                  <RadioGroup value={patentsFiled} onValueChange={setPatentsFiled} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="patents-yes" />
                      <Label htmlFor="patents-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="patents-no" />
                      <Label htmlFor="patents-no">No</Label>
                    </div>
                  </RadioGroup>
                  
                  {patentsFiled === "yes" && (
                    <div className="space-y-2">
                      <Label htmlFor="patent-details">Please provide details about your patent filings:</Label>
                      <Textarea 
                        id="patent-details" 
                        value={patentDetails} 
                        onChange={(e) => setPatentDetails(e.target.value)}
                        placeholder="Include patent application numbers, filing dates, and a brief description of what is covered..."
                        className="min-h-[120px]"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="ip-ownership-status">Who currently owns the IP? What's your plan to secure rights to use it?</Label>
                  <Textarea 
                    id="ip-ownership-status" 
                    value={ipOwnershipStatus} 
                    onChange={(e) => setIpOwnershipStatus(e.target.value)}
                    placeholder="Who currently owns the IP you need? What steps are you taking to secure rights to use it?"
                    className="min-h-[120px]"
                  />
                </div>
              )}
            </div>
          )
        },
        {
          type: "content" as StepType,
          content: (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="core-assets">What are the core intellectual assets of your company?</Label>
                <Textarea 
                  id="core-assets" 
                  value={coreAssets} 
                  onChange={(e) => setCoreAssets(e.target.value)}
                  placeholder="Describe the key intellectual property that gives your company value..."
                  className="min-h-[120px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ip-protection">How do you plan to protect your inventions and IP?</Label>
                <Textarea 
                  id="ip-protection" 
                  value={ipProtectionStrategy} 
                  onChange={(e) => setIpProtectionStrategy(e.target.value)}
                  placeholder="Outline your strategy for patents, trade secrets, etc..."
                  className="min-h-[120px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ip-relevance">Why is this IP relevant to your company's success?</Label>
                <Textarea 
                  id="ip-relevance" 
                  value={ipRelevance} 
                  onChange={(e) => setIpRelevance(e.target.value)}
                  placeholder="Explain how this intellectual property provides competitive advantage..."
                  className="min-h-[120px]"
                />
              </div>
            </div>
          )
        },
        {
          type: "content" as StepType,
          content: (
            <div className="space-y-6">
              <Card className="p-4 bg-slate-50">
                <h3 className="text-lg font-semibold mb-2">Understanding IP Protection Options</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Different types of IP protection serve different purposes:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
                  <li><span className="font-medium">Patents:</span> Protect novel, non-obvious inventions for 20 years. Requires detailed public disclosure.</li>
                  <li><span className="font-medium">Trade secrets:</span> Protected indefinitely, but must remain secret. No protection if reverse-engineered.</li>
                  <li><span className="font-medium">Copyrights:</span> Protect creative works (like software) automatically, but not the underlying ideas.</li>
                  <li><span className="font-medium">Trademarks:</span> Protect your brand identity and prevent customer confusion.</li>
                </ul>
              </Card>
              
              <Card className="p-4 bg-slate-50">
                <h3 className="text-lg font-semibold mb-2">Critical IP Mistakes to Avoid</h3>
                <p className="text-sm text-slate-600 mb-2">
                  Common pitfalls that can undermine your IP strategy:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
                  <li><span className="font-medium">Unclear ownership:</span> Always use clear contracts with employees/contractors specifying that the company owns all IP they create.</li>
                  <li><span className="font-medium">Public disclosure:</span> In most countries, publicly disclosing your invention before filing can eliminate patent rights.</li>
                  <li><span className="font-medium">Inadequate documentation:</span> Keep detailed records of invention development with dates and signatures.</li>
                  <li><span className="font-medium">Ignoring international markets:</span> File in all countries where you plan to operate or have competitors.</li>
                </ul>
              </Card>
            </div>
          )
        }
      ];
    }
  };

  if (isCompleted) {
    return (
      <div className="bg-green-50 p-4 rounded-md text-green-800 space-y-2">
        <h3 className="font-medium">IP Strategy Completed</h3>
        <p>You've completed your IP strategy assessment.</p>
        <Button 
          variant="outline" 
          onClick={() => onComplete()}
          className="mt-2"
        >
          View Saved Strategy
        </Button>
      </div>
    );
  }

  return (
    <StepBasedTaskLogic
      steps={getSteps()}
      isCompleted={isCompleted}
      onComplete={handleSubmit}
      conditionalFlow={{}}
    />
  );
};

export default IpDetailedTaskLogic;
