/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import AboutNumerology from './pages/AboutNumerology';
import AddFamilyMember from './pages/AddFamilyMember';
import AdminNumerology from './pages/AdminNumerology';
import AmyLegacy from './pages/AmyLegacy';
import AstrologyLearning from './pages/AstrologyLearning';
import BoujeeZodiacRoyale from './pages/BoujeeZodiacRoyale';
import BrothersLegacy from './pages/BrothersLegacy';
import CalendarEvents from './pages/CalendarEvents';
import ChristianLegacy from './pages/ChristianLegacy';
import Community from './pages/Community';
import FamilyLegacy from './pages/FamilyLegacy';
import FamilyTree from './pages/FamilyTree';
import Games from './pages/Games';
import GenealogyResearch from './pages/GenealogyResearch';
import GrandparentsLegacy from './pages/GrandparentsLegacy';
import Home from './pages/Home';
import Horoscopes from './pages/Horoscopes';
import HouseHunt from './pages/HouseHunt';
import HouseHuntAsimov from './pages/HouseHuntAsimov';
import HouseHuntClarke from './pages/HouseHuntClarke';
import HouseHuntCrichton from './pages/HouseHuntCrichton';
import HouseHuntDahl from './pages/HouseHuntDahl';
import HouseHuntElon from './pages/HouseHuntElon';
import HouseHuntGann from './pages/HouseHuntGann';
import HouseHuntKobe from './pages/HouseHuntKobe';
import HouseHuntMarley from './pages/HouseHuntMarley';
import HouseHuntMeagher from './pages/HouseHuntMeagher';
import HouseHuntRowling from './pages/HouseHuntRowling';
import HouseHuntSeuss from './pages/HouseHuntSeuss';
import HouseHuntTrump from './pages/HouseHuntTrump';
import JoinFamily from './pages/JoinFamily';
import KyleLegacy from './pages/KyleLegacy';
import Landing from './pages/Landing';
import MaherHistory from './pages/MaherHistory';
import MaherLegacy from './pages/MaherLegacy';
import MarketingPage from './pages/MarketingPage';
import MealRecommendations from './pages/MealRecommendations';
import MelanieLegacy from './pages/MelanieLegacy';
import NumerologyBattle from './pages/NumerologyBattle';
import NumerologyBlackjack from './pages/NumerologyBlackjack';
import NumerologyWar from './pages/NumerologyWar';
import ParentsLegacy from './pages/ParentsLegacy';
import PersonalDashboard from './pages/PersonalDashboard';
import PlanetaryTransits from './pages/PlanetaryTransits';
import ShareApp from './pages/ShareApp';
import StephenLegacy from './pages/StephenLegacy';
import ZodiacCompatibility from './pages/ZodiacCompatibility';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AboutNumerology": AboutNumerology,
    "AddFamilyMember": AddFamilyMember,
    "AdminNumerology": AdminNumerology,
    "AmyLegacy": AmyLegacy,
    "AstrologyLearning": AstrologyLearning,
    "BoujeeZodiacRoyale": BoujeeZodiacRoyale,
    "BrothersLegacy": BrothersLegacy,
    "CalendarEvents": CalendarEvents,
    "ChristianLegacy": ChristianLegacy,
    "Community": Community,
    "FamilyLegacy": FamilyLegacy,
    "FamilyTree": FamilyTree,
    "Games": Games,
    "GenealogyResearch": GenealogyResearch,
    "GrandparentsLegacy": GrandparentsLegacy,
    "Home": Home,
    "Horoscopes": Horoscopes,
    "HouseHunt": HouseHunt,
    "HouseHuntAsimov": HouseHuntAsimov,
    "HouseHuntClarke": HouseHuntClarke,
    "HouseHuntCrichton": HouseHuntCrichton,
    "HouseHuntDahl": HouseHuntDahl,
    "HouseHuntElon": HouseHuntElon,
    "HouseHuntGann": HouseHuntGann,
    "HouseHuntKobe": HouseHuntKobe,
    "HouseHuntMarley": HouseHuntMarley,
    "HouseHuntMeagher": HouseHuntMeagher,
    "HouseHuntRowling": HouseHuntRowling,
    "HouseHuntSeuss": HouseHuntSeuss,
    "HouseHuntTrump": HouseHuntTrump,
    "JoinFamily": JoinFamily,
    "KyleLegacy": KyleLegacy,
    "Landing": Landing,
    "MaherHistory": MaherHistory,
    "MaherLegacy": MaherLegacy,
    "MarketingPage": MarketingPage,
    "MealRecommendations": MealRecommendations,
    "MelanieLegacy": MelanieLegacy,
    "NumerologyBattle": NumerologyBattle,
    "NumerologyBlackjack": NumerologyBlackjack,
    "NumerologyWar": NumerologyWar,
    "ParentsLegacy": ParentsLegacy,
    "PersonalDashboard": PersonalDashboard,
    "PlanetaryTransits": PlanetaryTransits,
    "ShareApp": ShareApp,
    "StephenLegacy": StephenLegacy,
    "ZodiacCompatibility": ZodiacCompatibility,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};