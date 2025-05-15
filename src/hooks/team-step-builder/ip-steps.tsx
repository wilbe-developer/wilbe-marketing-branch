
import React from "react";
import { EnhancedStep } from "./types";
import FileUploader from "@/components/sprint/FileUploader";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const getIPSteps = (
  universityIP: boolean | undefined,
  ttoEngaged: boolean | undefined,
  ttoConversation: string | undefined,
  ttoTerms: string | undefined,
  ttoPlans: string | undefined,
  ownAllIP: boolean | undefined,
  patentsFiled: boolean | undefined,
  patentDocuments: string | undefined,
  patentPlans: string | undefined,
  ipOwnershipStatus: string | undefined,
  onTtoEngagedChange: (value: boolean) => void,
  onTtoConversationChange: (value: string) => void,
  onTtoTermsChange: (value: string) => void,
  onTtoPlansChange: (value: string) => void,
  onOwnAllIPChange: (value: boolean) => void,
  onPatentsFiledChange: (value: boolean) => void,
  onPatentDocumentsChange: (value: string) => void,
  onPatentPlansChange: (value: string) => void,
  onIPOwnershipStatusChange: (value: string) => void,
  onFileUpload: (fileId: string) => void
): EnhancedStep[] => {
  const steps: EnhancedStep[] = [];

  // If university IP is true, add TTO questions
  if (universityIP === true) {
    steps.push({
      type: "form",
      context: "ip",
      title: "Tech Transfer Office",
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Have you begun conversations with the Tech Transfer Office (TTO)?</h3>
            <div className="flex space-x-4">
              <RadioGroup
                value={ttoEngaged === true ? "yes" : ttoEngaged === false ? "no" : undefined}
                onValueChange={(val) => onTtoEngagedChange(val === "yes")}
                className="flex space-x-4"
              >
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
          </div>
        </div>
      )
    });

    // If TTO engaged is true
    if (ttoEngaged === true) {
      steps.push({
        type: "form",
        context: "ip",
        title: "TTO Conversation Details",
        content: (
          <div className="space-y-6">
            <div>
              <Label className="block text-sm font-medium mb-2">Summarize the conversation with the TTO.</Label>
              <Textarea 
                className="w-full"
                value={ttoConversation || ""}
                onChange={(e) => onTtoConversationChange(e.target.value)}
                rows={4}
              />
            </div>
            <div>
              <Label className="block text-sm font-medium mb-2">List the preliminary licensing terms (especially % equity) the TTO expects (agreed or mentioned).</Label>
              <Textarea 
                className="w-full"
                value={ttoTerms || ""}
                onChange={(e) => onTtoTermsChange(e.target.value)}
                rows={4}
              />
            </div>
          </div>
        )
      });
    } 
    // If TTO engaged is false
    else if (ttoEngaged === false) {
      steps.push({
        type: "form",
        context: "ip",
        title: "TTO Engagement Plans",
        content: (
          <div className="space-y-6">
            <div>
              <Label className="block text-sm font-medium mb-2">Explain your current plans for engaging with the TTO.</Label>
              <Textarea 
                className="w-full"
                value={ttoPlans || ""}
                onChange={(e) => onTtoPlansChange(e.target.value)}
                rows={4}
              />
            </div>
          </div>
        )
      });
    }
  }

  // IP Ownership questions (displayed for all users)
  steps.push({
    type: "form",
    context: "ip",
    title: "IP Ownership",
    content: (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Do you own all the IP?</h3>
          <RadioGroup
            value={ownAllIP === true ? "yes" : ownAllIP === false ? "no" : undefined}
            onValueChange={(val) => onOwnAllIPChange(val === "yes")}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="own-ip-yes" />
              <Label htmlFor="own-ip-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="own-ip-no" />
              <Label htmlFor="own-ip-no">No</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    )
  });

  // If user owns all IP
  if (ownAllIP === true) {
    steps.push({
      type: "form",
      context: "ip",
      title: "Patent Status",
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Have patents been filed?</h3>
            <RadioGroup
              value={patentsFiled === true ? "yes" : patentsFiled === false ? "no" : undefined}
              onValueChange={(val) => onPatentsFiledChange(val === "yes")}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="patents-yes" />
                <Label htmlFor="patents-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="patents-no" />
                <Label htmlFor="patents-no">No</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      )
    });

    // If patents filed
    if (patentsFiled === true) {
      steps.push({
        type: "form",
        context: "ip",
        title: "Patent Documents",
        content: (
          <div className="space-y-6">
            <div>
              <Label className="block text-sm font-medium mb-2">Upload your patent documents.</Label>
              <FileUploader 
                onFileUploaded={onFileUpload}
                isCompleted={!!patentDocuments}
              />
            </div>
          </div>
        )
      });
    } 
    // If patents not filed
    else if (patentsFiled === false) {
      steps.push({
        type: "form",
        context: "ip",
        title: "Patent Plans",
        content: (
          <div className="space-y-6">
            <div>
              <Label className="block text-sm font-medium mb-2">Explain your plans for filing patents.</Label>
              <Textarea 
                className="w-full"
                value={patentPlans || ""}
                onChange={(e) => onPatentPlansChange(e.target.value)}
                rows={4}
              />
            </div>
          </div>
        )
      });
    }
  } 
  // If user doesn't own all IP
  else if (ownAllIP === false) {
    steps.push({
      type: "form",
      context: "ip",
      title: "IP Ownership Status",
      content: (
        <div className="space-y-6">
          <div>
            <Label className="block text-sm font-medium mb-2">Explain the current status of IP ownership.</Label>
            <Textarea 
              className="w-full"
              value={ipOwnershipStatus || ""}
              onChange={(e) => onIPOwnershipStatusChange(e.target.value)}
              rows={4}
            />
          </div>
        </div>
      )
    });
  }

  // IP Fundamentals panel for all users
  steps.push({
    type: "content",
    context: "ip",
    title: "IP Fundamentals",
    content: (
      <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
        <h3 className="text-lg font-medium mb-3">IP Fundamentals</h3>
        <ul className="list-disc ml-5 space-y-2">
          <li>You are the core asset of the company.</li>
          <li>Role of inventions and why protecting them is crucial.</li>
          <li>Why this IP is relevant to the company.</li>
          <li>Raising funding for a science company without foundational IP.</li>
          <li>Defining an IP strategy that matches market validation and strategy.</li>
        </ul>
      </div>
    )
  });

  // University-IP Deep-Dive panel for university IP cases
  if (universityIP === true) {
    steps.push({
      type: "content",
      context: "ip",
      title: "University-IP Deep-Dive",
      content: (
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <h3 className="text-lg font-medium mb-3">University-IP Deep-Dive</h3>
          <ul className="list-disc ml-5 space-y-2">
            <li>What is a Tech Transfer Office (TTO)?</li>
            <li>How do they think and evaluate inventions?</li>
            <li>Do they actually own your IP?</li>
            <li>When / how should you approach them?</li>
            <li>Switching from employee mindset to founder of an independent company.</li>
            <li>Why nobody else can negotiate on your behalf (lawyers, investors, advisors, etc.).</li>
            <li>Why this is the best opportunity to evolve as a founder.</li>
            <li>The mother of all tricks: do not start negotiations until all the ducks are in a row.</li>
            <li>The nuclear option: can you build without this IP?</li>
          </ul>
        </div>
      )
    });
  }

  return steps;
};
