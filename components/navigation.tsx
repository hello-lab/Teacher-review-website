"use client";

import { authClient } from "@/lib/auth-client";
import {useRouter} from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
export default function Layout({ dbStatus }: { dbStatus?: string }) {
    const router = useRouter()
    const [hidden,setHidden]=useState(true);
    const [mobileMenuOpen,setMobileMenuOpen]=useState(false);
    const { data: session, isPending } = authClient.useSession();   
const items=[
            {
                label: "Teachers",
                href: "/teachers",
               
            },
            
            { label: "Review", href: "/review" },
            { label: "FeedBack", href: "/reporting" },
          
        ]

return (
    <header className="relative flex items-center justify-between px-4 py-3 border-b bg-gray-100">
        <>
            <input id="mobile-menu-toggle" type="checkbox" className="hidden" />
            <label
                htmlFor="mobile-menu-toggle"
                className="mobileMenuBtn md:hidden inline-flex flex-col gap-1 w-10 h-10 items-center justify-center p-1 rounded-md cursor-pointer focus:outline-none"
                aria-label="Toggle menu"
                role="button"
                tabIndex={0}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
                <span className="block w-5 h-[2px] bg-gray-900 rounded" />
                <span className="block w-5 h-[2px] bg-gray-900 rounded" />
                <span className="block w-5 h-[2px] bg-gray-900 rounded" />
            </label>

            <div
                className={`mobileMenu absolute top-14 left-3 w-56 bg-white border border-gray-200 shadow-lg p-3 rounded-lg z-50 ${mobileMenuOpen ? "block" : "hidden"}`}
                aria-hidden="true"
               
            >
                <nav>
                    <ul className="flex flex-col gap-2 m-0 p-0 list-none">
                        {items.map((item) => (
                            <li key={item.href}>
                                <a
                                    href={item.href}
                                    className="block text-gray-700 no-underline px-2 py-1 rounded hover:bg-gray-100"
                                    onClick={() => {
                                        const toggle = document.getElementById(
                                            "mobile-menu-toggle"
                                        ) as HTMLInputElement | null;
                                        if (toggle) toggle.checked = false;
                                    }}
                                >
                                    {item.label}
                                </a>
                            </li>
                            
                        ))}
                        
                    </ul>
                </nav>

                
            </div>

            <style>{`
                @media (max-width: 640px) {
                    .desktopops { display: none !important; }
                    #mobile-menu-toggle:checked + label + .mobileMenu { display: block; }
                }
                @media (min-width: 641px) {
                    .mobileMenu { display: none !important; }
                    .mobileMenuBtn { display: none !important; }
                }
            `}</style>
        </>
        <div className="flex items-center gap-6">
            <a href="/" className="font-bold text-secondary text-2xl">TeacherReview</a>

            <nav className="desktopops">
                <ul className="flex gap-2">
                    {items.map((item) => (
                        <li key={item.href} className="relative">
                            <a href={item.href} className="text-gray-700 px-3 py-1 rounded hover:bg-gray-100 inline-block">
                                {item.label}
                            </a>
                        </li>
                    ))}
                    
                </ul>
            </nav>
                </div>
                
        <div className="flex items-center gap-4">
            <div   className="bg-gray-200 rounded-full p-2 hover:bg-gray-300 "
            onClick={() => setHidden(!hidden)}
            >
                <FontAwesomeIcon color="gray" size="xl" icon={faUser} /></div>
            <div className={`flex ${hidden ? "hidden" : ""}  flex-col sm:flex-row items-center gap-2 fixed right-[3vw] top-[9vh] bg-gray-200 px-3 py-2 rounded-md shadow-md`}> 
            {isPending ? (
                <span>Loading...</span>
            ) : session?.user ? (
                <>
                    <span className="mr-2 text-gray-900">{session.user.name ?? session.user.email}</span>
                    <button type="button" onClick={() => authClient.signOut()} className="px-3 py-1 rounded-md bg-gray-800">Sign out</button>
                </>
            ) : (
                
                <button type="button" onClick={() => router.push("/login")} className="px-3 py-1 rounded-md bg-gray-600 text-white">Sign in</button>
            )}<Badge variant={dbStatus === "Database connected" ? "default" : "destructive"} className="px-3 py-1 text-xs whitespace-nowrap rounded-md">
                                                    {dbStatus ?? "Unknown"}
                                                </Badge></div>
            
        </div>
    </header>
)


}