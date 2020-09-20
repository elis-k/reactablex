var path = require('path');

module.exports = {
    mode: 'production',
    entry: path.resolve(__dirname, 'src/reactable.jsx'),
    output: {
        path: path.resolve(__dirname, 'lib'),
        filename: 'reactable.js',
		libraryTarget: 'commonjs2'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
	externals: {

		'simplebar-react':{
			root: 'SimpleBarReact',
			commonjs2: 'simplebar-react',
            commonjs: 'simplebar-react',
            amd: 'simplebar-react'
		},
        react: {
            root: 'React',
            commonjs2: 'react',
            commonjs: 'react',
            amd: 'react'
        },
        'react-dom': {
            root: 'ReactDOM',
            commonjs2: 'react-dom',
            commonjs: 'react-dom',
            amd: 'react-dom'
        }
    },
    module: {
       rules : [
			{
				test : /\.jsx?/,
				loader : 'babel-loader',
				exclude: path.resolve(__dirname, 'node_modules'),
		
				options: {
					presets: [
							"@babel/preset-env", "@babel/preset-react"
						]
				}
			
			},
			{
				test: /\.css$/i,
				exclude: path.resolve(__dirname, 'node_modules'),
				use: ['style-loader', 'css-loader'],
			},
		]
    },
    
}