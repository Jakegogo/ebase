该前端使用，nodeJS + gulp + bower来构建，提供依赖包管理，自动构建能力

1、安装git.exe，从github官网下载安装文件
   安装完成配置到环境变量(Path)
2、安装nodeJs，
	下载Node.js官方Windows可执行程序
	安装完成配置到环境变量(Path)
	打开命令行，执行：npm config set registry=http://registry.npmjs.org，原https好像下载有问题。
	安装bower：npm install bower -g
	安装gulp：npm install gulp -g 
	
3、到工程目录，分别执行：
	1）npm install，在工程目录下会出现一个目录，node_modules
	2）bower install，在工程目录下会出现一个目录，bower_components
	
4、开发，现在较为初级的应用，显得比较笨拙，后续再优化
	1）清除工程输出：gulp clean
	2）编译：gulp
	3）热编译：gulp watch
	4）运行服务：node server.js，需另开一个命令窗口
	
5、项目目录结构
	1）src为源码目录
	2）dist为编译输出目录
	
6、提交到git
	WebStorm开发环境可参考http://xupeixuan.iteye.com/blog/1850809