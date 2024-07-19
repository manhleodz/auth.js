import Link from "next/link"
import AuthButtons from "./ui/AuthButtons";
import ThemeSwitch from "./ui/theme-switch";
import MobileNav from "./ui/mobile-nav";

export interface INavigation {
    name: string
    href: string
}

const navigation: INavigation[] = [
    { name: "Home", href: "/" },
    { name: "Infinite scroll", href: "/infinite-scroll" },
]

export default function NavBar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-muted bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
            <nav className="fixed inset-x-0 top-0 flex items-center justify-end z-50 bg-white shadow-sm">
                <div className="max-lg:hidden w-full max-w-7xl mx-auto px-4">
                    <div className="flex justify-between h-14 items-center">
                        <div></div>
                        <nav className="hidden md:flex gap-4">
                            <Link
                                href="/"
                                className="font-medium flex items-center text-sm transition-colors hover:underline"
                                prefetch={false}
                            >
                                Home
                            </Link>
                            <Link
                                href="#"
                                className="font-medium flex items-center text-sm transition-colors hover:underline"
                                prefetch={false}
                            >
                                About
                            </Link>
                        </nav>
                        <div className="flex items-center gap-4">
                            <AuthButtons />
                            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                                <ThemeSwitch />
                            </div>
                        </div>
                    </div>
                </div>
                <MobileNav navigation={navigation} />
            </nav>
        </header>
    )
}