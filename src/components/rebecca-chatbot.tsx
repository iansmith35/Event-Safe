
"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { Send, Bot, Loader2 } from "lucide-react";
import Textarea from 'react-textarea-autosize';
import { rebeccaChat } from '@/ai/flows/rebecca-chat';
import { callRebecca, isRebeccaAvailable } from '@/lib/rebecca';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from './ui/scroll-area';

interface Message {
    role: 'user' | 'model';
    content: string;
}

export default function RebeccaChatbot() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', content: "Hi! I'm Rebecca. How can I help you understand EventSafe today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [aiDisabledUntil, setAiDisabledUntil] = useState<number | null>(null);
    const { toast } = useToast();
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const handleSendMessage = useCallback(async (currentInput: string) => {
        if (!currentInput.trim() || isLoading) return;

        // Check if AI is temporarily disabled
        if (aiDisabledUntil && Date.now() < aiDisabledUntil) {
            return; // Still within cooldown period
        }

        const userMessage: Message = { role: 'user', content: currentInput };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Check if Rebecca is available via feature flags
            const available = await isRebeccaAvailable();
            if (!available) {
                const fallbackMessage: Message = {
                    role: 'model',
                    content: "Rebecca AI is currently disabled. This feature is temporarily unavailable. Please contact our support team at support@eventsafe.id for assistance."
                };
                setMessages(prev => [...prev, fallbackMessage]);
                return;
            }

            // Try the new Rebecca endpoint first, fallback to existing AI
            try {
                const rebeccaResponse = await callRebecca(currentInput);
                if (rebeccaResponse.success && rebeccaResponse.data) {
                    setMessages(prev => [...prev, { role: 'model', content: rebeccaResponse.data.response || rebeccaResponse.data }]);
                    return;
                }
            } catch (rebeccaError) {
                console.warn("Rebecca endpoint failed, falling back to local AI:", rebeccaError);
            }

            // Fallback to existing AI flow
            const response = await rebeccaChat({
                message: currentInput,
                conversationHistory: [...messages, userMessage],
            });
            setMessages(prev => [...prev, { role: 'model', content: response.response }]);
        } catch (error) {
            console.warn("AI temporarily unavailable:", error);
            
            // Show user-friendly message and keep them on the page
            const fallbackMessage: Message = { 
                role: 'model', 
                content: "Rebecca is temporarily unavailable. I'm experiencing some technical difficulties right now. Please try again in a moment, or contact our support team at support@eventsafe.id if you need immediate help with EventSafe!"
            };
            
            setMessages(prev => [...prev, fallbackMessage]);
            
            // Disable send for 10 seconds, then re-enable
            const disableUntil = Date.now() + 10000;
            setAiDisabledUntil(disableUntil);
            
            setTimeout(() => {
                setAiDisabledUntil(null);
            }, 10000);

            // Show non-intrusive toast
            toast({
                title: "Rebecca is temporarily unavailable",
                description: "Please try again in a moment",
                duration: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, messages, toast, aiDisabledUntil]);
    
    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages]);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSendMessage(input);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bot /> Ask Rebecca
                </CardTitle>
                <CardDescription>Your guide to the EventSafe platform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <ScrollArea className="h-64 w-full pr-4" ref={scrollAreaRef}>
                     <div className="space-y-4">
                        {messages.map((message, index) => (
                            <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                                {message.role === 'model' && (
                                    <Avatar className="w-8 h-8 border">
                                        <AvatarImage src="https://placehold.co/40x40.png" alt="Rebecca" data-ai-hint="female avatar" />
                                        <AvatarFallback>R</AvatarFallback>
                                    </Avatar>
                                )}
                                <div className={`max-w-[80%] rounded-lg p-3 text-sm ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                    <p>{message.content}</p>
                                </div>
                            </div>
                        ))}
                         {isLoading && (
                            <div className="flex items-start gap-3">
                                <Avatar className="w-8 h-8 border">
                                    <AvatarImage src="https://placehold.co/40x40.png" alt="Rebecca" data-ai-hint="female avatar" />
                                    <AvatarFallback>R</AvatarFallback>
                                </Avatar>
                                <div className="bg-muted rounded-lg p-3 flex items-center">
                                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-4 border-t">
                    <Textarea
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                        placeholder="Type your message..."
                        className="flex-1 resize-none text-foreground placeholder:text-muted-foreground caret-foreground bg-background"
                        minRows={1}
                        maxRows={5}
                        disabled={isLoading || Boolean(aiDisabledUntil && Date.now() < aiDisabledUntil)}
                    />
                    <Button type="submit" size="icon" disabled={isLoading || !input.trim() || Boolean(aiDisabledUntil && Date.now() < aiDisabledUntil)}>
                        <Send />
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
