
"use client";

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { Send, Bot, Loader2 } from "lucide-react";
import Textarea from 'react-textarea-autosize';
import { rebeccaChat } from '@/ai/flows/rebecca-chat';
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
    const { toast } = useToast();
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await rebeccaChat({
                message: input,
                conversationHistory: messages,
            });
            setMessages(prev => [...prev, { role: 'model', content: response.response }]);
        } catch (error) {
            console.error("Error chatting with Rebecca:", error);
            toast({
                variant: 'destructive',
                title: "Error",
                description: "Could not get a response from Rebecca. Please try again."
            });
             // Add the user's message back to the input if the API call fails
            setInput(userMessage.content);
            setMessages(prev => prev.slice(0, prev.length -1));
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages]);

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

                <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-4 border-t">
                    <Textarea
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage(e);
                            }
                        }}
                        placeholder="Type your message..."
                        className="flex-1 resize-none"
                        minRows={1}
                        maxRows={5}
                        disabled={isLoading}
                    />
                    <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                        <Send />
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
