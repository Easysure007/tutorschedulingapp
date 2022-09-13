import NextDocument, { Html, Head, Main, NextScript } from "next/document";
import { ToastContainer } from "react-toastify";

export default class Document extends NextDocument {
	render() {
		return (
			<Html>
				<Head>
					<link
						href="http://fonts.cdnfonts.com/css/clash-display"
						rel="stylesheet"
					/>
					<link rel="stylesheet" href="style.css" />
					<link rel="preconnect" href="https://fonts.googleapis.com" />
					<link
						href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
						rel="stylesheet"
					></link>
				</Head>
				<body>
					<Main />
					<NextScript />
					<ToastContainer />
				</body>
			</Html>
		);
	}
}
