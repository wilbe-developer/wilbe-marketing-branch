
import React from 'react';
import Section from './Section';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';

const FAQSection: React.FC = () => {
  return (
    <Section id="faq" className="bg-white">
      <div className="max-w-3xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="space-y-2">
          <AccordionItem value="item-1" className="border rounded-lg p-2 px-4">
            <AccordionTrigger className="text-left font-medium">Who is BSF for?</AccordionTrigger>
            <AccordionContent>
              <p className="mt-2">
                BSF is designed for scientists and engineers – postdocs, PhDs, early PIs, or those working in industry - who are hungry to solve a very large problem using science and engineering breakthroughs and believe business is the right vehicle for this.
              </p>
              <p className="mt-2">
                You at the earliest of stages - you are about to build or have just started building your company (pre-incorporation is fine) - you have not raised any venture capital yet and you have a sense of urgency to figure out the most optimal company path.
              </p>
              <p className="mt-2">
                You are strongly encouraged to apply even if in doubt of eligibility.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="border rounded-lg p-2 px-4">
            <AccordionTrigger className="text-left font-medium">Is there a cost to participate in BSF?</AccordionTrigger>
            <AccordionContent>
              <p className="mt-2">
                No. BSF is free, there is no signing of anything and no agreements to complete BSF.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="border rounded-lg p-2 px-4">
            <AccordionTrigger className="text-left font-medium">How long does it run for?</AccordionTrigger>
            <AccordionContent>
              <p className="mt-2">
                BSF is designed so that with momentum and resolve you can complete it in 10 days. Having said that, you can complete it at your own pace however long it takes.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="border rounded-lg p-2 px-4">
            <AccordionTrigger className="text-left font-medium">Do I have to finish BSF in 10 days?</AccordionTrigger>
            <AccordionContent>
              <p className="mt-2">
                If you finish BSF in 10 days successfully, you will qualify for investment analysis and we'll accelerate the process for you. But you will not be removed from the platform if you choose to take longer.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5" className="border rounded-lg p-2 px-4">
            <AccordionTrigger className="text-left font-medium">How do you make the investment decision?</AccordionTrigger>
            <AccordionContent>
              <p className="mt-2">
                At Wilbe, we flip the legacy playbook of investing in science. We focus on the human potential first, followed by market and then the science. When trying to understand if we're a match we try our best to get an understanding of certain indicators for example: an obsession to solve the problem at hand, a desire to solve the biggest version of the problem, commercial intuition, technical competence, ability to communicate big ideas with simplicity and clarity, ability to hold two opposing ideas at once and a positive force to work with - transparent, generous and optimistic in spirit.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6" className="border rounded-lg p-2 px-4">
            <AccordionTrigger className="text-left font-medium">What are the terms of the investment?</AccordionTrigger>
            <AccordionContent>
              <p className="mt-2">
                This tends to be $100K - $250K for single digit equity (using a SAFE note) and we are typically your first investment partner. Based on our experience, a tried and tested playbook for building science companies does not exist - you are not creating a new service, often you are creating an entire new industry. This is why we don't believe in "cookie cutter" standard investment terms. Throughout the process of BSF you will be asked to create or provide your roadmap and plan, you tell us how much you need, and based on your ask we will be able to assess and offer you terms tailored to you. If you need more capital we can activate our network of co-investors and angels. Once invested, we have the capacity to double down in future rounds.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-7" className="border rounded-lg p-2 px-4">
            <AccordionTrigger className="text-left font-medium">How long does it take to get an investment decision?</AccordionTrigger>
            <AccordionContent>
              <p className="mt-2">
                Once you complete the program, we take <strong>up to 3 working days</strong> to evaluate your work and invite you for a 1:1 session. After we meet each other we tend to send investment decisions within two weeks, but this may differ on a case by case bases.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-8" className="border rounded-lg p-2 px-4">
            <AccordionTrigger className="text-left font-medium">What if I am already in the process of closing a pre-seed round?</AccordionTrigger>
            <AccordionContent>
              <p className="mt-2">
                If you've secured a lead investor then reach out to Dee (capital@wilbe.com) with your deck and we can take it from there.
              </p>
              <p className="mt-2">
                <strong>If you are still putting your round together</strong>, we believe it's still worth going through the 10-day BSF process. In practice, many such founders complete it in just one day, and it gives us a chance to get to know each other. If there's a strong fit, we can move straight into discussing a direct pre-seed investment.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-9" className="border rounded-lg p-2 px-4">
            <AccordionTrigger className="text-left font-medium">Do I need to have an incorporated company to apply?</AccordionTrigger>
            <AccordionContent>
              <p className="mt-2">
                No, you can go through BSF without an incorporated company.
              </p>
              <p className="mt-2">
                Note, we only invest once your company is incorporated in the <strong>US, UK, or Europe</strong> – and we're happy to help guide you through this.
              </p>
              <p className="mt-2">
                In fact, we strongly recommend waiting to incorporate until you have a clear plan. We've seen expensive mistakes made when founders incorporate too early. It's worth getting the foundations right from the start.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-10" className="border rounded-lg p-2 px-4">
            <AccordionTrigger className="text-left font-medium">Are there any geographic restrictions?</AccordionTrigger>
            <AccordionContent>
              <p className="mt-2">
                No, you can join BSF from anywhere and benefit from the platform. But note we invest only in companies incorporated in the <strong>US, UK, or Europe</strong>.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-11" className="border rounded-lg p-2 px-4">
            <AccordionTrigger className="text-left font-medium">When and where is the next in-person residency?</AccordionTrigger>
            <AccordionContent>
              <p className="mt-2">
                The in-person residency happens regularly with Wilbe Founders who have gone through BSF. Details for each session are announced well in advance to allow you to plan. Keep an eye out on the discussion boards once you join BSF.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-12" className="border rounded-lg p-2 px-4">
            <AccordionTrigger className="text-left font-medium">What is the expected time commitment?</AccordionTrigger>
            <AccordionContent>
              <p className="mt-2">
                As much as you wish to put in. If you manage to complete BSF within 10 days or less then we will evaluate your venture for investment and see if we can help bring your company into the world together.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-13" className="border rounded-lg p-2 px-4">
            <AccordionTrigger className="text-left font-medium">What happens post investment?</AccordionTrigger>
            <AccordionContent>
              <p className="mt-2">
                Based on our experience of building high performance science companies, our insight into market signals, and our expansive network of experts and co-investors, we support you in building the company in whatever way is needed. There tends to be three phases to our work together:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>
                  <strong>Get all ducks in a row!</strong> Do we have everything in place, including momentum, to put together the first institutional investment round, typically the pre-seed or seed round? This includes crafting the best narrative for your company, getting the story right, stress testing the business model with you, securing your first customer agreement(s) and making sure we are building the best version of the company.
                </li>
                <li>
                  <strong>Close your fundraise.</strong> We then work on the fundraising strategy and plan together, this includes identifying the right investors for you and with you, tailoring the dataroom, running dry-runs with our community of warm investors, launching introductions, and helping you close the raise in a time boxed manner raising capital from aligned investors.
                </li>
                <li>
                  <strong>Continued support.</strong> We continue to help you set up operations and get going with the build. This will include engagement with the broader founder community as well as continued regular sessions with the team as needed. We occasionally serve as Board Observers on a case-by-case basis.
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-14" className="border rounded-lg p-2 px-4">
            <AccordionTrigger className="text-left font-medium">What happens if I don't get investment?</AccordionTrigger>
            <AccordionContent>
              <p className="mt-2">
                If you don't get investment immediately then there are two possibilities. Either we will be continuing the conversation towards an investment within 2 weeks of completing BSF. This is a situation where us or you need to get to know each other and what is being built better.
              </p>
              <p className="mt-2">
                The other possibility is that we are not a match for you as investors. This can happen even in cases where what is being built is very good and ambitious. In this case you will still be part of the Wilbe Community and will have completed BSF, establishing the core foundations, similar to the best of science companies.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-15" className="border rounded-lg p-2 px-4">
            <AccordionTrigger className="text-left font-medium">Can I start and complete the process at a later date?</AccordionTrigger>
            <AccordionContent>
              <p className="mt-2">
                You can start and finish the program any time, and at your own pace. However, we only consider submissions for investment if they're completed within <strong>10 days</strong> of starting.
              </p>
              <p className="mt-2">
                If you think BSF is too advanced for your current stage, please join Wilbe Sandbox (link wilbe.com/sandbox) with free educational content and a community of like-minded scientists.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-16" className="border rounded-lg p-2 px-4">
            <AccordionTrigger className="text-left font-medium">Why are you doing this?</AccordionTrigger>
            <AccordionContent>
              <p className="mt-2">
                Google, Deepmind, Genentech, Moderna, HP, Bose Inc, Boston Dynamics, BioNTech and many more world-changing companies were started by scientists and engineers who could have stayed in academia. In most of these cases, the biggest risk isn't the science—it's everything around it. Startups have become the engine of real-world impact, but navigating that world isn't part of most research training. We're here to help you avoid the expensive mistakes, and to give you the backing and tools to perform to your best capacity. We have had the privilege of equipping thousands of scientists on business know how and core operational skills which has led to the creation of companies like <a href="https://www.proximafusion.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Proxima Fusion</a>, <a href="https://apoha.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Apoha</a>, <a href="https://www.expressionedits.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ExpressionEdits</a> and more - where we are also the first investors.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Section>
  );
};

export default FAQSection;
