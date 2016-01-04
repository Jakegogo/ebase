/**
 * 单页面路由配置
 * @param path  url路径
 * @param html  静态页面路径(在views目录下)
 * @param js  javascript路径
 * @type {*[]}
 */
var routeConfig = [
{name:'欢迎界面', path:'/dashboard', html:'home/dashboard.html', files:['js/controllers/home/dashboardController.js'], controller: "DashboardController"},
]