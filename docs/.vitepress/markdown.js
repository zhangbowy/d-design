const markdown = {
    config: (md) => {
        const { demoBlockPlugin } = require('vitepress-theme-demoblock')
        md.use(demoBlockPlugin, {
            cssPreprocessor: 'less'
        })
    }
}
export default markdown
