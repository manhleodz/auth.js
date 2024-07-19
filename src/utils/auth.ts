import Router from 'next/router'

export const checkAuth = (auth: any, role: any, ctx: any) => {
    const user = auth.get('user')
    if (role === 'admin' && (user.size === 0 || !user.get('is_admin'))) {
        if (ctx.req) {
            ctx.res.writeHead(302, { Location: '/' })
            ctx.res.end()
        }
        if (!ctx.isServer) {
            Router.push('/')
        }
    }

    if (role === 'user' && user.size === 0) {
        if (ctx.req) {
            ctx.res.writeHead(302, { Location: '/' })
            ctx.res.end()
        }
        if (!ctx.isServer) {
            Router.push('/')
        }
    }
}
