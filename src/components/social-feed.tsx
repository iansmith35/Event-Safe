
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Rss, Users } from 'lucide-react';
import Image from 'next/image';

const feedItems = [
    {
        id: 1,
        author: "EventSafe Official",
        handle: "@eventsafe",
        avatar: "https://placehold.co/40x40.png",
        content: "<p>🎉 Announcing our biggest event yet! The <b>Summer Safety Rave</b> is coming this August. Early bird tickets with EventSafe Pay are now available. Don't miss out! #EventSafe #SummerRave</p>",
        image: "https://placehold.co/600x400.png",
        imageHint: "party rave",
        timestamp: "2h ago",
    },
    {
        id: 2,
        author: "Venue Spotlight: The Velvet Rope",
        handle: "@velvetrope",
        avatar: "https://placehold.co/40x40.png",
        content: "<p>We're proud to be an EventSafe verified venue! Your safety is our priority. Come check out our Kink-Positive night this Friday. 10% off for EventSafe members.</p>",
        timestamp: "1d ago",
    },
     {
        id: 3,
        author: "EventSafe Official",
        handle: "@eventsafe",
        avatar: "https://placehold.co/40x40.png",
        content: "<p>New Feature Alert! 🚀 Our AI-powered Social Media Promoter is now in beta. Let us help you fill your next event. Activate your free trial in the admin dashboard! #AI #EventPromo</p>",
        timestamp: "3d ago",
    },
]


export default function SocialFeed() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Rss />EventSafe Feed</CardTitle>
                <CardDescription>Official announcements and event highlights. Read-only.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {feedItems.map(item => (
                    <div key={item.id} className="flex gap-4">
                        <Image src={item.avatar} alt={item.author} width={40} height={40} className="rounded-full h-10 w-10" data-ai-hint="logo" />
                        <div className="flex-1">
                            <div className="flex items-baseline gap-2">
                                <span className="font-bold">{item.author}</span>
                                <span className="text-sm text-muted-foreground">{item.handle}</span>
                                <span className="text-xs text-muted-foreground ml-auto">{item.timestamp}</span>
                            </div>
                            <div className="text-sm mt-1" dangerouslySetInnerHTML={{ __html: item.content }} />
                             {item.image && (
                                <Image 
                                    src={item.image} 
                                    alt="Post image" 
                                    width={600} 
                                    height={400} 
                                    className="mt-2 rounded-lg border"
                                    data-ai-hint={item.imageHint}
                                />
                             )}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}

    