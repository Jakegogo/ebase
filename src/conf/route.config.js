/**
 * 单页面路由配置
 * @param path  url路径
 * @param html  静态页面路径(在views目录下)
 * @param requires js文件
 * @param controller controller名称
 * @param files 其它文件(如css)
 * @param depends angular模块依赖
 * @type {*[]}
 */
var routeConfig = [
    {
        name:'欢迎界面',
        path:'/dashboard',
        html:'home/dashboard.html',
        requireJs:['controllers/home/dashboardController'],
        controller: "DashboardController"
    },
    {
        name:'测试',
        path:'/test',
        html:'test/test.html',
        requireJs:['controllers/test/test'],
        controller: "TestController",
        files:['vendor/checklist-model/checklist-model.js'],
        depends:['checklist-model']
    }
]