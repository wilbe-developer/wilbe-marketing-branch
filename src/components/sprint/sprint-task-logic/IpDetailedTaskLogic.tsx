
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useSprintProfileQuickEdit } from "@/hooks/useSprintProfileQuickEdit";
import { useSprintAnswers } from "@/hooks/useSprintAnswers";
import { Card } from "@/components/ui/card";
import StepBasedTaskLogic, { StepType, Step } from "../StepBasedTaskLogic";

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
                <p className="font-medium">Have you begun conversations with the university's Technology Transfer Office?</p>
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
                    <Label htmlFor="tto-details">Summarize your conversations with the TTO so far:</Label>
                    <Textarea 
                      id="tto-details" 
                      value={ttoConversationDetails} 
                      onChange={(e) => setTtoConversationDetails(e.target.value)}
                      placeholder="Describe your interactions with the TTO and the current status of your negotiations..."
                      className="min-h-[120px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="licensing-terms">What are the preliminary licensing terms being discussed?</Label>
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
                  <Label htmlFor="tto-plans">Explain your current plans for engaging with the TTO:</Label>
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
                <h3 className="text-lg font-semibold mb-2">Understanding Technology Transfer Offices</h3>
                <p className="text-sm text-slate-600 mb-4">
                  TTOs are responsible for managing and commercializing a university's intellectual property. Here's what you need to know:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
                  <li><span className="font-medium">How TTOs think:</span> They aim to commercialize university research while generating revenue for the institution.</li>
                  <li><span className="font-medium">IP ownership:</span> Determine if the university actually owns your IP by reviewing your employment contract and how/when the invention was created.</li>
                  <li><span className="font-medium">Approach timing:</span> Engage early, but be prepared with a clear valuation argument.</li>
                  <li><span className="font-medium">Founder mindset:</span> When talking to the TTO, you're no longer just a researcher or employee - you're a founder negotiating a business deal.</li>
                  <li><span className="font-medium">Negotiation:</span> Nobody else can negotiate on your behalf. The terms you agree to will profoundly impact your company's future.</li>
                  <li><span className="font-medium">Opportunity framing:</span> Position your startup as the best vehicle to bring the technology to market and generate returns for the university.</li>
                </ul>
              </Card>
              
              <Card className="p-4 bg-slate-50">
                <h3 className="text-lg font-semibold mb-2">Negotiation Strategies</h3>
                <p className="text-sm text-slate-600 mb-2">
                  Here are some key strategies when negotiating with TTOs:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
                  <li>Focus on future value, not past investment by the university</li>
                  <li>Consider milestone-based payments rather than large equity stakes</li>
                  <li>Distinguish between exclusive and non-exclusive licensing terms</li>
                  <li>Prepare a market analysis showing the commercialization path</li>
                  <li>Demonstrate your unique ability to bring this technology to market</li>
                  <li>Remember you can walk away and develop alternative technologies</li>
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
                <p className="font-medium">Does your company own all the intellectual property it needs?</p>
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
                  <p className="font-medium">Have patents been filed for your key innovations?</p>
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
                  <Label htmlFor="ip-ownership-status">Explain the current status of your IP ownership:</Label>
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
                  Different types of IP protection serve different purposes. Consider your options:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
                  <li><span className="font-medium">Patents:</span> Protect novel, non-obvious inventions for 20 years, but require public disclosure.</li>
                  <li><span className="font-medium">Trade secrets:</span> Can potentially last indefinitely but offer no protection if discovered independently.</li>
                  <li><span className="font-medium">Copyrights:</span> Protect creative expressions (software code, content) for decades.</li>
                  <li><span className="font-medium">Trademarks:</span> Protect brand identifiers indefinitely with proper maintenance.</li>
                </ul>
              </Card>
              
              <Card className="p-4 bg-slate-50">
                <h3 className="text-lg font-semibold mb-2">Building an IP Strategy</h3>
                <p className="text-sm text-slate-600 mb-2">
                  Consider these elements when developing your IP strategy:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
                  <li>Focus on protecting what provides your competitive advantage</li>
                  <li>Balance cost of protection against the value of the IP</li>
                  <li>Consider geographic markets where protection is most important</li>
                  <li>Develop a timeline for filing patents based on development progress</li>
                  <li>Implement internal processes to document innovations and maintain trade secrets</li>
                  <li>Create clear IP ownership agreements with all employees, contractors, and partners</li>
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
