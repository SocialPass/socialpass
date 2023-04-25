import { createContext, useContext, useState, useEffect } from "react";

import { EventContext } from "./EventContext";
import { Theme as ThemeType } from "@/types/Event";

export const ThemeContext = createContext({});

const getDefaultCss = () =>
	`${
		import.meta.env.VITE_APP_API_URL || "http://localhost:8000"
	}/static/socialpass-theme/socialpass-theme.css`;

const getDefaultLogo = () =>
	`${
		import.meta.env.VITE_APP_API_URL || "http://localhost:8000"
	}/static/brand-logos/SocialPass-Icon.svg`;

export const ThemeProvider = ({ children }: any) => {
	const { event } = useContext(EventContext);
	const [theme, setTheme] = useState<ThemeType | null>(null);
	const [isReady, setIsReady] = useState(false);

	const createCSS = (href, type, rel, media) => {
		const el = document.createElement("link");
		el.href = href;
		el.type = type;
		el.rel = rel;
		el.media = media;

		return el;
	};

	const createFavicon = (href, rel) => {
		const el = document.createElement("link");
		el.href = href;
		el.rel = rel;

		return el;
	};

	useEffect(() => {
		const newTheme = {
			brand_name: "SocialPass",
			favicon: getDefaultLogo(),
			logo: getDefaultLogo(),
			css_theme: getDefaultCss(),
		};

		if (event) {
			if (event?.team?.theme?.css_theme) {
				newTheme.brand_name = event.team.theme?.brand_name;
				newTheme.favicon = event.team?.theme?.logo;
				newTheme.logo = event.team?.theme?.logo;
				newTheme.css_theme = event.team?.theme?.css_theme;
			}

			const link = createCSS(newTheme.css_theme, "text/css", "stylesheet", "screen,print");
			const favIcon = createFavicon(newTheme.favicon, "icon");
			window.icon = newTheme.favicon;

			document.getElementsByTagName("head")[0].appendChild(link);
			document.getElementsByTagName("head")[0].appendChild(favIcon);

			setTheme(newTheme);
			setIsReady(true);
		}
	}, [event]);

	return (
		<ThemeContext.Provider
			value={{
				theme,
				setTheme,
				isReady,
			}}
		>
			{children}
		</ThemeContext.Provider>
	);
};

export default ThemeProvider;
