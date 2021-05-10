import Link from 'next/link';

export default ({currentUser}) => {
    const links = [
        !currentUser && { label: 'Sign Up', href: '/auth/signup' },
        !currentUser && { labels: 'Sign in', href: '/auth/signin' },
        currentUser && { label: 'Sell Tickets', href: '/tickets/new'},
        currentUser && { label: 'My Orders', href: '/orders'},
        currentUser && { label: 'Sign Out', href: '/auth/signout' }
    ]
        .filter(linkConfig => linkConfig)    
        .map(({label, href}) => {
            return <li key={href}>
                <Link href={href} className="nav-item">
                    <a className="nav-link">{label}</a>
                </Link>
            </li>;
        });
    return <nav className="navbar navbar-light bg-light">
        <Link href="/" className="nav-item">
            <a className="navbar-brand">Ticketing</a>
        </Link>
        <div className="d-flex justify-content-end">
            <ul classname="nav d-flex align-items-center">
                {links}
            </ul>
        </div>
    </nav>;
}