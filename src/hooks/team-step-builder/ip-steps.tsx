
import React from "react";
import { EnhancedStep } from "./types";
import { Textarea } from "@/components/ui/textarea";
import FileUploader from "@/components/sprint/FileUploader";
import UploadedFileView from "@/components/sprint/UploadedFileView";

export const getIPSteps = (
  universityIP: boolean | undefined,
  formData: {
    ttoConversationSummary: string;
    preliminaryTerms: string;
    ttoEngagementPlans: string;
    patentsFilingPlans: string;
    ipOwnershipStatus: string;
  },
  patentsFiled: boolean | undefined,
  uploadedFileId: string | undefined,
  onFormDataChange: (field: string, value: string) => void,
  onPatentsFiledChange: (filed: boolean) => void,
  onFileUpload: (fileId: string) => void
): EnhancedStep[] => {
  // Start with empty steps array
  const steps: EnhancedStep[] = [];

  // Common content step for everyone
  steps.push({
    type: "content",
    context: "ip_status",
    title: "Intellectual Property Fundamentals",
    content: [
      <div key="ip-fundamentals" className="space-y-4">
        <p>You are the core asset of the company. Your expertise and vision are central to your startup's success.</p>
        <p>Intellectual property plays a crucial role in science and deep tech startups. Here's why:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>IP protects your innovations from competitors</li>
          <li>IP is a significant asset for fundraising, especially for science companies</li>
          <li>Your IP is highly relevant to your company's success</li>
          <li>Defining an IP strategy should match your market validation and business strategy</li>
        </ul>
      </div>
    ]
  });

  // Conditional steps based on universityIP
  if (universityIP === true) {
    // TTO conversation question
    steps.push({
      type: "form",
      context: "ip_status",
      title: "Tech Transfer Office Engagement",
      content: [
        <div key="tto-question" className="space-y-4">
          <h3 className="text-lg font-medium">Have you begun conversations with the Tech Transfer Office (TTO)?</h3>
          <div className="flex gap-4 mt-2">
            <button 
              onClick={() => onPatentsFiledChange(true)}
              className={`px-4 py-2 rounded ${patentsFiled === true ? 'bg-brand-pink text-white' : 'bg-gray-100'}`}
            >
              Yes
            </button>
            <button 
              onClick={() => onPatentsFiledChange(false)}
              className={`px-4 py-2 rounded ${patentsFiled === false ? 'bg-brand-pink text-white' : 'bg-gray-100'}`}
            >
              No
            </button>
          </div>
        </div>
      ]
    });

    // TTO engagement dependent questions
    if (patentsFiled === true) {
      steps.push({
        type: "form",
        context: "tto_status",
        title: "TTO Conversation Details",
        content: [
          <div key="tto-conversation" className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Summarize the conversation with the TTO:</h3>
              <Textarea 
                value={formData.ttoConversationSummary}
                onChange={(e) => onFormDataChange('ttoConversationSummary', e.target.value)}
                placeholder="Describe the key points discussed, any concerns raised, and next steps..."
                rows={4}
                className="w-full"
              />
            </div>
            <div className="mt-4">
              <h3 className="font-medium mb-2">List the preliminary licensing terms (especially % equity) the TTO expects:</h3>
              <Textarea 
                value={formData.preliminaryTerms}
                onChange={(e) => onFormDataChange('preliminaryTerms', e.target.value)}
                placeholder="Detail equity percentages, royalty rates, milestone payments, etc."
                rows={4}
                className="w-full"
              />
            </div>
          </div>
        ]
      });
    } else if (patentsFiled === false) {
      steps.push({
        type: "form",
        context: "tto_status",
        title: "TTO Engagement Plans",
        content: [
          <div key="tto-plans" className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Explain your current plans for engaging with the TTO:</h3>
              <Textarea 
                value={formData.ttoEngagementPlans}
                onChange={(e) => onFormDataChange('ttoEngagementPlans', e.target.value)}
                placeholder="Outline your timeline, approach, and preparation strategy..."
                rows={4}
                className="w-full"
              />
            </div>
          </div>
        ]
      });
    }
    
    // Add deep-dive educational content for university IP
    steps.push({
      type: "content",
      context: "tto_status",
      title: "TTO Negotiation Strategy",
      content: [
        <div key="tto-strategy" className="space-y-4">
          <h3 className="text-lg font-medium">Strategic Approaches to TTO Negotiations</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>What is a Tech Transfer Office (TTO) and how do they evaluate inventions</li>
            <li>Do they actually own your IP? Understanding ownership clearly</li>
            <li>When and how you should approach them for negotiations</li>
            <li>Switch from employee mindset to founder of an independent company</li>
            <li>Nobody else can negotiate on your behalf effectively (not lawyers, investors, or advisors)</li>
            <li>This is a key opportunity to evolve as a founder</li>
            <li>The mother of all tricks: do not start negotiations until all your preparation is complete</li>
            <li>The nuclear option: consider if you can build without this IP</li>
          </ul>
        </div>
      ]
    });
  } else if (universityIP === false) {
    // IP ownership question
    steps.push({
      type: "form",
      context: "ip_status",
      title: "IP Ownership",
      content: [
        <div key="ip-ownership-question" className="space-y-4">
          <h3 className="text-lg font-medium">Do you own all the IP?</h3>
          <div className="flex gap-4 mt-2">
            <button 
              onClick={() => onPatentsFiledChange(true)}
              className={`px-4 py-2 rounded ${patentsFiled === true ? 'bg-brand-pink text-white' : 'bg-gray-100'}`}
            >
              Yes
            </button>
            <button 
              onClick={() => onPatentsFiledChange(false)}
              className={`px-4 py-2 rounded ${patentsFiled === false ? 'bg-brand-pink text-white' : 'bg-gray-100'}`}
            >
              No
            </button>
          </div>
        </div>
      ]
    });

    // IP ownership dependent questions
    if (patentsFiled === true) {
      // Patent status question - THIS IS WHERE THE ERROR IS OCCURRING
      // We need to ensure we're not directly comparing true and false literal types
      steps.push({
        type: "form",
        context: "ip_status",
        title: "Patent Status",
        content: [
          <div key="patent-status-question" className="space-y-4">
            <h3 className="text-lg font-medium">Have patents been filed?</h3>
            <div className="flex gap-4 mt-2">
              <button 
                onClick={() => onPatentsFiledChange(true)}
                className={`px-4 py-2 rounded ${patentsFiled ? 'bg-brand-pink text-white' : 'bg-gray-100'}`}
              >
                Yes
              </button>
              <button 
                onClick={() => onPatentsFiledChange(false)}
                className={`px-4 py-2 rounded ${patentsFiled === false ? 'bg-brand-pink text-white' : 'bg-gray-100'}`}
              >
                No
              </button>
            </div>
          </div>
        ]
      });
      
      // Patents filed dependent actions
      if (patentsFiled) {
        steps.push({
          type: "content",
          context: "ip_status",
          title: "Patent Documentation",
          content: [
            <div key="patent-upload" className="space-y-4">
              <h3 className="font-medium mb-2">Upload your patent documentation</h3>
              <p className="text-sm text-gray-600 mb-4">
                This can include patent applications, granted patents, or relevant correspondence with patent offices.
              </p>
              {uploadedFileId ? (
                <UploadedFileView
                  fileId={uploadedFileId}
                  isCompleted={false}
                />
              ) : (
                <FileUploader
                  onFileUploaded={onFileUpload}
                  isCompleted={false}
                />
              )}
            </div>
          ]
        });
      } else if (patentsFiled === false) {
        steps.push({
          type: "form",
          context: "ip_status",
          title: "Patent Filing Plans",
          content: [
            <div key="patent-filing-plans" className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Explain your plans for filing patents:</h3>
                <Textarea 
                  value={formData.patentsFilingPlans}
                  onChange={(e) => onFormDataChange('patentsFilingPlans', e.target.value)}
                  placeholder="Describe your patent filing strategy, timeline, and approach..."
                  rows={4}
                  className="w-full"
                />
              </div>
            </div>
          ]
        });
      }
    } else if (patentsFiled === false) {
      steps.push({
        type: "form",
        context: "ip_status",
        title: "IP Ownership Status",
        content: [
          <div key="ip-ownership-status" className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Explain the current status of IP ownership:</h3>
              <Textarea 
                value={formData.ipOwnershipStatus}
                onChange={(e) => onFormDataChange('ipOwnershipStatus', e.target.value)}
                placeholder="Describe who owns the IP, any complications or concerns, and your strategy to secure ownership..."
                rows={4}
                className="w-full"
              />
            </div>
          </div>
        ]
      });
    }
  }

  return steps;
};
