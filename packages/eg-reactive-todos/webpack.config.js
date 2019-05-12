const { CheckerPlugin } = require('awesome-typescript-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

const DIST = __dirname + '/pub/dist'
module.exports = {
	entry: './index.ts',
	output: {
		filename: 'app-[hash].js',
		chunkFilename: '[name]-[hash].lazy.js',
		path: DIST,
		publicPath: '/',
	},

	// Enable sourcemaps for debugging webpack's output.
	devtool: 'source-map',

	devServer: {
		contentBase: __dirname + '/pub',
		historyApiFallback: true,
	},

	resolve: {
		// Add '.ts' and '.tsx' as resolvable extensions.
		extensions: ['.ts', '.js', '.json']
	},

	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: 'awesome-typescript-loader',
				options: {
					useBabel: true,
					useCache: true,
				},
				exclude: [/.test.ts/],
			},
			// All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
			{ enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
		],
	},

	optimization: {
		runtimeChunk: 'single',
		splitChunks: {
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					chunks: 'all',
				}
			}
		}
	},

	plugins: [
		new CheckerPlugin(),
		new HtmlWebpackPlugin({
			title: 'CRUI - Todos Example',
			filename: DIST + '/index.html',
			template: __dirname + '/index.ejs',
		}),
		new webpack.DefinePlugin({
			WEBPACK: 'true',
			IS_DEV: JSON.stringify(process.env.NODE_ENV === 'development')
		}),
		new webpack.HashedModuleIdsPlugin()
	],
}