'use client'

import React, { useState } from 'react'
import { CornerDownLeft } from "lucide-react"
import portraitImage from '@/images/portrait.jpg'
import { SimpleLayout } from '@/components/SimpleLayout'
import { Button } from "@/components/ui/button"
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat-bubble"
import { ChatMessageList } from "@/components/ui/chat-message-list"
import { ChatInput } from "@/components/ui/chat-input"
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion'
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

const LINKEDIN_URL = "https://www.linkedin.com/in/jasonweingardt/"
const CV_URL = "/Jason_Weingardt_CV.pdf"

const MODELS = {
  deepseek: {
    name: "DeepSeek R1",
    id: "deepseek"
  },
  gemini: {
    name: "Gemini 2.0",
    id: "google/gemini-2.0-flash-001"
  }
};

const PREDEFINED_RESPONSES = {
  "Can I see your resume?": `I'd be happy to share my professional background! You can:

1. Download my CV directly [here](${CV_URL})
2. View my LinkedIn profile [here](${LINKEDIN_URL})
3. Check out my detailed work history on my [work page](/work)

I'm currently a Product Manager at CloudKitchens, leading the development of autonomous ghost kitchens. I work to develop and support both software and hardware products, most notably the CloudKitchens handoff products and conveyance systems. Before that, I worked at Ritual, Postmates, and Uber. I have over a decade of experience in technology and product management, with a focus on operational technology and automation.

Would you like me to highlight any specific part of my experience?`,

  "Tell me about your PM experience": `I've worked in Product for over a decade, with my most recent role being at CloudKitchens. You can find my complete work history on my [LinkedIn profile](${LINKEDIN_URL}) or download my [detailed CV](${CV_URL}).

At CloudKitchens, I've spent the past four years working alongside backend, frontend, and hardware engineers to develop the CloudKitchens handoff products and conveyance systems. At previous companies, like Uber, my role sat more on the marketplace operations level, but I sought opportunities to work closely with central product and engineering teams to test, iterate, and scale new products and features. 

What I like most about Product Management is that it allows for my generalist nature to shine. While there are plenty of reasons to specialize, I've found that being good at many areas of the business allows for easier stakeholder management and collaboration with other teams.

Would you like to know more about any specific role or project?`,

  "What side projects have you built?": `My time outside of work is, of course, spent with my wife and daughter, but in my downtime I'm a tinkerer. This website you're on is one of my favorite projects, as it allows me to build and learn on a lot of the tools I use professionally. 

  I'm also extremely embedded into the smart home space, and I have leveraged Home Assistant (https://www.home-assistant.io/) to automate my home. I've also built a few automation tools that I've used to make my life easier, like automations that use cameras and motion/occupancy sensors to turn on lights, scare deer away, and elevate home security.`,

  "Are you a technical PM?": `Yes, I consider myself a technical PM! I'm a technical generalist who can write code, design systems, and understand complex technical concepts. However, I believe my real value comes from connecting different technical domains to solve problems.

While I maintain hands-on technical skills, I focus on using this technical understanding to make better product decisions and communicate effectively with engineering teams. Would you like to hear about how I balance technical and product responsibilities in my current role?`,

  "What are your most popular photos on Unsplash?": `Check out my Unsplash page [here](https://unsplash.com/@jasonweingardt) to see my most popular photos. I've enjoyed publishing my best shots under the CC0 license, and my photos have been viewed over 30 million times. You can also view stats on my home page by hovering over a photo. I built the tool on that page that ties in to the Unsplash API.`,

  "What are your most popular photos?": `You can check out my Unsplash page [here](https://unsplash.com/@jasonweingardt) to see my most popular photos. I've enjoyed publishing my best shots under the CC0 license, and my photos have been viewed over 30 million times.`,

  "What are you working on currently?": `Currently, I'm focused on several exciting initiatives:

At CloudKitchens, I'm leading the development of Otter Lockers, which are smart food lockers that alow for contactsless handoff to delivery drivers and customers picking up orders. I lea the GTM and operationnal strategy, and have taken it from 0-->1, as well as grown ARR by over 150% in the first year.

I'm also focused on building end-to-end robotic conveyance inside our facilities, using a mix of ML/AI and robotics to convey and hand off orders all without human intervention.`
};

const SYSTEM_MESSAGE = {
  id: 0,
  content: "Hi, I'm Jason! I'm happy to chat about my work experience, side projects, or approach to product management. What would you like to know?",
  sender: "ai"
};

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gemini");

  const placeholders = [
    "What's your experience with product management?",
    "Tell me about your work at CloudKitchens",
    "What projects are you most proud of?",
    "How do you approach technical decisions?",
    "What do you do for fun?",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        content: userMessage,
        sender: "user",
      },
    ]);
    setInput("");
    setIsChatLoading(true);
    setShowChat(true);

    try {
      // Check for predefined responses first
      if (PREDEFINED_RESPONSES[userMessage]) {
        // Add artificial delay between 1-2 seconds for predefined responses
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            content: PREDEFINED_RESPONSES[userMessage],
            sender: "ai",
          },
        ]);
        setIsChatLoading(false);
        return;
      }

      const conversationHistory = messages
        .map((msg) => `${msg.sender === 'user' ? 'User' : 'Jason'}: ${msg.content}`)
        .join('\n');

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: userMessage,
          history: conversationHistory,
          model: selectedModel
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          content: data.response,
          sender: "ai",
        },
      ]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          content: "I'm sorry, I encountered an error while processing your request. Please try again later.",
          sender: "ai",
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleHeroSubmit = (e) => {
    e.preventDefault();
    const value = e.target.querySelector('input').value;
    setInput(value);
    handleSubmit(e);
  };

  return (
    <SimpleLayout>
      <div>
        <AnimatePresence mode="wait">
          {!showChat ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center"
            >
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 text-center">
                Chat with Jason
              </h1>
              <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400 text-center max-w-2xl mb-4">
                Ask me anything about my work experience, side projects, or approach to product management.
              </p>
              <div className="w-full max-w-2xl">
                <PlaceholdersAndVanishInput
                  placeholders={placeholders}
                  onChange={(e) => setInput(e.target.value)}
                  onSubmit={handleHeroSubmit}
                />
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-800/5 dark:bg-white/5 hover:bg-zinc-800/10 dark:hover:bg-white/10 transition-colors"
                    onClick={() => {
                      setInput("Can I see your resume?");
                      const message = "Can I see your resume?";
                      setMessages((prev) => [...prev, { id: prev.length + 1, content: message, sender: "user" }]);
                      setInput("");
                      setIsChatLoading(true);
                      setShowChat(true);
                      
                      setTimeout(() => {
                        setMessages((prev) => [...prev, {
                          id: prev.length + 1,
                          content: PREDEFINED_RESPONSES[message],
                          sender: "ai",
                        }]);
                        setIsChatLoading(false);
                      }, 1000 + Math.random() * 1000);
                    }}
                  >
                    <span className="text-emerald-500">📄</span>
                    See resume
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-800/5 dark:bg-white/5 hover:bg-zinc-800/10 dark:hover:bg-white/10 transition-colors"
                    onClick={() => {
                      setInput("Tell me about your PM experience");
                      const message = "Tell me about your PM experience";
                      setMessages((prev) => [...prev, { id: prev.length + 1, content: message, sender: "user" }]);
                      setInput("");
                      setIsChatLoading(true);
                      setShowChat(true);
                      
                      setTimeout(() => {
                        setMessages((prev) => [...prev, {
                          id: prev.length + 1,
                          content: PREDEFINED_RESPONSES[message],
                          sender: "ai",
                        }]);
                        setIsChatLoading(false);
                      }, 1000 + Math.random() * 1000);
                    }}
                  >
                    <span className="text-sky-500">💼</span>
                    PM Experience
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-800/5 dark:bg-white/5 hover:bg-zinc-800/10 dark:hover:bg-white/10 transition-colors"
                    onClick={() => {
                      setInput("What side projects have you built?");
                      const message = "What side projects have you built?";
                      setMessages((prev) => [...prev, { id: prev.length + 1, content: message, sender: "user" }]);
                      setInput("");
                      setIsChatLoading(true);
                      setShowChat(true);
                      
                      setTimeout(() => {
                        setMessages((prev) => [...prev, {
                          id: prev.length + 1,
                          content: PREDEFINED_RESPONSES[message],
                          sender: "ai",
                        }]);
                        setIsChatLoading(false);
                      }, 1000 + Math.random() * 1000);
                    }}
                  >
                    <span className="text-blue-500">🛠️</span>
                    Side Projects
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-800/5 dark:bg-white/5 hover:bg-zinc-800/10 dark:hover:bg-white/10 transition-colors"
                    onClick={() => {
                      setInput("What are your most popular photos on Unsplash?");
                      const message = "What are your most popular photos on Unsplash?";
                      setMessages((prev) => [...prev, { id: prev.length + 1, content: message, sender: "user" }]);
                      setInput("");
                      setIsChatLoading(true);
                      setShowChat(true);
                      
                      setTimeout(() => {
                        setMessages((prev) => [...prev, {
                          id: prev.length + 1,
                          content: PREDEFINED_RESPONSES[message],
                          sender: "ai",
                        }]);
                        setIsChatLoading(false);
                      }, 1000 + Math.random() * 1000);
                    }}
                  >
                    <span className="text-orange-500">📸</span>
                    Best photos taken
                  </Button>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-800/5 dark:bg-white/5 hover:bg-zinc-800/10 dark:hover:bg-white/10 transition-colors"
                    onClick={() => {
                      setInput("What's your leadership philosophy?");
                      const message = "What's your leadership philosophy?";
                      setMessages((prev) => [...prev, { id: prev.length + 1, content: message, sender: "user" }]);
                      setInput("");
                      setIsChatLoading(true);
                      setShowChat(true);
                      
                      setTimeout(() => {
                        setMessages((prev) => [...prev, {
                          id: prev.length + 1,
                          content: PREDEFINED_RESPONSES[message],
                          sender: "ai",
                        }]);
                        setIsChatLoading(false);
                      }, 1000 + Math.random() * 1000);
                    }}
                  >
                    <span className="text-yellow-500">👥</span>
                    Leadership Style
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-800/5 dark:bg-white/5 hover:bg-zinc-800/10 dark:hover:bg-white/10 transition-colors"
                    onClick={() => {
                      setInput("What are your most popular photos?");
                      const message = "What are your most popular photos?";
                      setMessages((prev) => [...prev, { id: prev.length + 1, content: message, sender: "user" }]);
                      setInput("");
                      setIsChatLoading(true);
                      setShowChat(true);
                      
                      setTimeout(() => {
                        setMessages((prev) => [...prev, {
                          id: prev.length + 1,
                          content: PREDEFINED_RESPONSES[message],
                          sender: "ai",
                        }]);
                        setIsChatLoading(false);
                      }, 1000 + Math.random() * 1000);
                    }}
                  >
                    <span className="text-purple-500">🎯</span>
                    Product Decisions
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-800/5 dark:bg-white/5 hover:bg-zinc-800/10 dark:hover:bg-white/10 transition-colors"
                    onClick={() => {
                      setInput("What are you working on currently?");
                      const message = "What are you working on currently?";
                      setMessages((prev) => [...prev, { id: prev.length + 1, content: message, sender: "user" }]);
                      setInput("");
                      setIsChatLoading(true);
                      setShowChat(true);
                      
                      setTimeout(() => {
                        setMessages((prev) => [...prev, {
                          id: prev.length + 1,
                          content: PREDEFINED_RESPONSES[message],
                          sender: "ai",
                        }]);
                        setIsChatLoading(false);
                      }, 1000 + Math.random() * 1000);
                    }}
                  >
                    <span className="text-cyan-500">🚀</span>
                    Current Work
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 sm:mt-6"
            >
              <div className="h-[600px] border bg-background rounded-lg flex flex-col">
                <div className="border-b p-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Chat with Jason</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Model:</span>
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="text-sm bg-background border rounded-md px-2 py-1"
                    >
                      {Object.entries(MODELS).map(([id, model]) => (
                        <option key={id} value={id}>
                          {model.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex-1 overflow-hidden">
                  <ChatMessageList className="px-4 space-y-4">
                    {messages.map((message) => (
                      <ChatBubble
                        key={message.id}
                        variant={message.sender === "user" ? "sent" : "received"}
                        className={`flex items-end gap-2 ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                      >
                        {message.sender === "user" ? null : (
                          <ChatBubbleAvatar
                            className="h-8 w-8 shrink-0"
                            src={portraitImage.src}
                            fallback="AI"
                          />
                        )}
                        <div className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} max-w-[80%]`}>
                          <ChatBubbleMessage
                            variant={message.sender === "user" ? "sent" : "received"}
                            className={`prose dark:prose-invert ${
                              message.sender === "user" 
                                ? "bg-sky-500 text-white rounded-2xl rounded-tr-none px-4 py-2" 
                                : "bg-muted rounded-2xl rounded-tl-none px-4 py-2"
                            }`}
                          >
                            {message.content}
                          </ChatBubbleMessage>
                        </div>
                      </ChatBubble>
                    ))}

                    {isChatLoading && (
                      <ChatBubble variant="received" className="flex items-end gap-2">
                        <ChatBubbleAvatar
                          className="h-8 w-8 shrink-0"
                          src={portraitImage.src}
                          fallback="AI"
                        />
                        <div className="flex justify-start max-w-[80%]">
                          <ChatBubbleMessage 
                            isLoading 
                            className="bg-muted rounded-2xl rounded-tl-none px-4 py-2" 
                          />
                        </div>
                      </ChatBubble>
                    )}
                  </ChatMessageList>
                </div>

                <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <div className="p-4">
                    <form
                      onSubmit={handleSubmit}
                      className="relative flex items-end gap-2"
                    >
                      <div className="relative flex-1">
                        <ChatInput
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="Ask me anything about my work..."
                          className="min-h-[56px] w-full resize-none rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 pr-12 shadow-sm focus-visible:ring-1 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600"
                        />
                        <Button 
                          type="submit" 
                          size="sm" 
                          className="absolute right-2 bottom-2 gap-1.5"
                        >
                          <CornerDownLeft className="size-3.5" />
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-24 mb-8 max-w-2xl mx-auto w-full"
        >
          <div className="h-px bg-zinc-200 dark:bg-zinc-800 mb-8" />
          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mb-4">How this Works</h2>
          <Accordion type="single" collapsible>
            <AccordionItem value="technical-details">
              <AccordionTrigger className="text-base font-semibold text-zinc-800 dark:text-zinc-100">
                Technical Implementation
              </AccordionTrigger>
              <AccordionContent>
                <div className="prose-sm dark:prose-invert text-zinc-600 dark:text-zinc-400">
                  <p className="text-sm font-semibold mb-2">Tech Stack & Architecture</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Next.js 14 with App Router and React Server Components</li>
                    <li>Tailwind CSS for styling with custom shadcn/ui components</li>
                    <li>TypeScript for type safety and better DX</li>
                    <li>LangChain.js for conversation management</li>
                  </ul>

                  <p className="text-sm font-semibold mt-4 mb-2">Core Components</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>ChatMessageList - Virtualized message container</li>
                    <li>ChatBubble - Message UI with Markdown support</li>
                    <li>ChatInput - Auto-expanding textarea with commands</li>
                  </ul>

                  <p className="text-sm mt-4">
                    Built with performance in mind using Edge Runtime for API routes and client-side state management with React hooks.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="ai-models">
              <AccordionTrigger className="text-base font-semibold text-zinc-800 dark:text-zinc-100">
                AI Models & Features
              </AccordionTrigger>
              <AccordionContent>
                <div className="prose-sm dark:prose-invert text-zinc-600 dark:text-zinc-400">
                  <p className="text-sm font-semibold mb-2">Language Models</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Primary: Gemini 2.0 via OpenRouter API</li>
                    <li>Fallback: DeepSeek R1 (70B parameters)</li>
                    <li>Auto-fallback on rate limits</li>
                  </ul>

                  <p className="text-sm font-semibold mt-4 mb-2">Advanced Features</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Vector embeddings for semantic search</li>
                    <li>Context-aware conversation history</li>
                    <li>Real-time message streaming</li>
                    <li>Optimistic UI updates</li>
                    <li>Dark mode support</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="data-privacy">
              <AccordionTrigger className="text-base font-semibold text-zinc-800 dark:text-zinc-100">
                Data & Privacy
              </AccordionTrigger>
              <AccordionContent>
                <div className="prose-sm dark:prose-invert text-zinc-600 dark:text-zinc-400">
                  <p className="text-sm">
                    This chat interface combines pre-defined responses with AI-generated content. Here's how your data is handled:
                  </p>
                  <ul className="list-disc list-inside space-y-1 mt-2 text-sm">
                    <li>Chat history is stored only in your browser session</li>
                    <li>No personal data is collected or stored</li>
                    <li>API calls are made through secure, encrypted connections</li>
                    <li>Conversation context is temporarily held in memory and cleared after each session</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="usage-tips">
              <AccordionTrigger className="text-base font-semibold text-zinc-800 dark:text-zinc-100">
                Usage Tips
              </AccordionTrigger>
              <AccordionContent>
                <div className="prose-sm dark:prose-invert text-zinc-600 dark:text-zinc-400">
                  <p className="text-sm">
                    Get the most out of your conversation:
                  </p>
                  <ul className="list-disc list-inside space-y-1 mt-2 text-sm">
                    <li>Use the quick-select buttons for common topics</li>
                    <li>Ask follow-up questions for deeper insights</li>
                    <li>Switch between AI models for different response styles</li>
                    <li>Press Enter to send, Shift+Enter for new lines</li>
                    <li>Click on any links to explore related content</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
      </div>
    </SimpleLayout>
  )
} 