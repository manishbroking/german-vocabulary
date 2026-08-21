import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  Plus,
  Trash2,
  Lightbulb,
  Check,
  X,
  BookOpen,
  Pencil,
  Home,
  Sparkles,
  Moon,
  Zap,
  Volume2,
  VolumeX,
  Music,
  Flame,
  Award,
  Layers,
  RotateCcw,
  Coffee,
  User,
  LogOut,
  Cloud,
  CloudOff,
  Loader2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
import {
  getUser,
  login,
  signup,
  logout,
  onAuthChange,
  handleAuthCallback,
  requestPasswordRecovery,
  updateUser,
  AuthError,
} from "@netlify/identity";

const ARTICLE_COLORS = {
  der: { text: "#3D5A8A", bg: "#E8EEF7", border: "#C4D3E8" },
  die: { text: "#A13D5C", bg: "#FBEAEF", border: "#EFC7D3" },
  das: { text: "#3F7859", bg: "#E9F3ED", border: "#C6E0D1" },
};

const POS_OPTIONS = ["noun", "verb", "adjective", "adverb", "phrase", "other"];

const CATEGORY_LIST = [
  { key: "time", label: "Time" },
  { key: "stationery", label: "Stationery" },
  { key: "house", label: "House" },
  { key: "furniture", label: "Furniture" },
  { key: "electronics", label: "Electronics" },
  { key: "transport", label: "Transport" },
  { key: "family", label: "Family" },
  { key: "people", label: "People" },
  { key: "food", label: "Food & drink" },
  { key: "tableware", label: "Tableware" },
  { key: "body", label: "Body" },
  { key: "clothing", label: "Clothing" },
  { key: "places", label: "Places" },
  { key: "professions", label: "Professions" },
  { key: "calendar", label: "Days & months" },
  { key: "verb", label: "Verbs" },
  { key: "adjective", label: "Adjectives" },
  { key: "adverb", label: "Adverbs" },
  { key: "other", label: "Other" },
  { key: "custom", label: "My own words" },
];
const CATEGORY_LABEL = Object.fromEntries(CATEGORY_LIST.map((c) => [c.key, c.label]));

const ALL_VOCABULARY_PACK = [
  
  ["der","Tag","noun","the day","Heute ist ein guter Tag. (Today is a good day.)","time"],
  ["die","Woche","noun","the week","Ich lerne jede Woche Deutsch. (I learn German every week.)","time"],
  ["das","Wochenende","noun","the weekend","Am Wochenende bin ich frei. (On the weekend I am free.)","time"],
  ["das","Jahr","noun","the year","Ein Jahr hat zwölf Monate. (A year has twelve months.)","time"],
  ["der","Monat","noun","the month","Dieser Monat ist wichtig. (This month is important.)","time"],
  ["die","Zeit","noun","the time","Ich habe keine Zeit. (I have no time.)","time"],
  ["der","Morgen","noun","the morning","Guten Morgen! (Good morning!)","time"],
  ["der","Nachmittag","noun","the afternoon","Am Nachmittag lerne ich Deutsch. (In the afternoon I learn German.)","time"],
  ["der","Abend","noun","the evening","Guten Abend! (Good evening!)","time"],
  ["die","Nacht","noun","the night","Gute Nacht! (Good night!)","time"],
  ["der","Stift","noun","the pen","Der Stift ist auf dem Tisch. (The pen is on the table.)","stationery"],
  ["der","Kuli","noun","the ballpoint pen","Ich schreibe mit einem Kuli. (I write with a ballpoint pen.)","stationery"],
  ["der","Bleistift","noun","the pencil","Der Bleistift ist neu. (The pencil is new.)","stationery"],
  ["das","Buch","noun","the book","Ich lese ein Buch. (I am reading a book.)","stationery"],
  ["das","Heft","noun","the notebook","Mein Heft ist voll. (My notebook is full.)","stationery"],
  ["das","Haus","noun","the house","Das Haus ist groß. (The house is big.)","house"],
  ["die","Tür","noun","the door","Bitte mach die Tür auf. (Please open the door.)","house"],
  ["das","Fenster","noun","the window","Das Fenster ist offen. (The window is open.)","house"],
  ["das","Dach","noun","the roof","Das Dach ist rot. (The roof is red.)","house"],
  ["der","Garten","noun","the garden","Wir sitzen im Garten. (We sit in the garden.)","house"],
  ["die","Garage","noun","the garage","Das Auto steht in der Garage. (The car is in the garage.)","house"],
  ["das","Zimmer","noun","the room","Mein Zimmer ist klein. (My room is small.)","house"],
  ["das","Wohnzimmer","noun","the living room","Wir sehen im Wohnzimmer fern. (We watch TV in the living room.)","house"],
  ["das","Schlafzimmer","noun","the bedroom","Ich schlafe im Schlafzimmer. (I sleep in the bedroom.)","house"],
  ["das","Badezimmer","noun","the bathroom","Das Badezimmer ist sauber. (The bathroom is clean.)","house"],
  ["die","Küche","noun","the kitchen","Meine Mutter kocht in der Küche. (My mother cooks in the kitchen.)","house"],
  ["die","Toilette","noun","the toilet","Wo ist die Toilette? (Where is the toilet?)","house"],
  ["der","Tisch","noun","the table","Das Buch liegt auf dem Tisch. (The book lies on the table.)","furniture"],
  ["der","Esstisch","noun","the dining table","Wir essen am Esstisch. (We eat at the dining table.)","furniture"],
  ["der","Stuhl","noun","the chair","Der Stuhl ist bequem. (The chair is comfortable.)","furniture"],
  ["das","Bett","noun","the bed","Ich gehe ins Bett. (I go to bed.)","furniture"],
  ["die","Lampe","noun","the lamp","Die Lampe ist hell. (The lamp is bright.)","furniture"],
  ["das","Sofa","noun","the sofa","Wir sitzen auf dem Sofa. (We sit on the sofa.)","furniture"],
  ["der","Fernseher","noun","the TV","Der Fernseher ist kaputt. (The TV is broken.)","electronics"],
  ["das","Radio","noun","the radio","Ich höre Radio. (I listen to the radio.)","electronics"],
  ["das","Handy","noun","the mobile phone","Mein Handy ist neu. (My phone is new.)","electronics"],
  ["der","Laptop","noun","the laptop","Ich arbeite am Laptop. (I work on the laptop.)","electronics"],
  ["der","Computer","noun","the computer","Der Computer ist langsam. (The computer is slow.)","electronics"],
  ["der","Kühlschrank","noun","the refrigerator","Die Milch ist im Kühlschrank. (The milk is in the refrigerator.)","electronics"],
  ["die","Waschmaschine","noun","the washing machine","Die Waschmaschine läuft. (The washing machine is running.)","electronics"],
  ["der","Zug","noun","the train","Der Zug kommt pünktlich. (The train arrives on time.)","transport"],
  ["der","Bus","noun","the bus","Ich fahre mit dem Bus. (I go by bus.)","transport"],
  ["das","Auto","noun","the car","Das Auto ist schnell. (The car is fast.)","transport"],
  ["das","Schiff","noun","the ship","Das Schiff fährt auf dem Meer. (The ship sails on the sea.)","transport"],
  ["das","Fahrrad","noun","the bicycle","Ich fahre gern Fahrrad. (I like riding a bicycle.)","transport"],
  ["das","Motorrad","noun","the motorcycle","Das Motorrad ist laut. (The motorcycle is loud.)","transport"],
  ["das","Flugzeug","noun","the plane","Das Flugzeug fliegt hoch. (The plane flies high.)","transport"],
  ["die","Mutter","noun","the mother","Meine Mutter kocht gut. (My mother cooks well.)","family"],
  ["der","Vater","noun","the father","Mein Vater arbeitet viel. (My father works a lot.)","family"],
  ["der","Bruder","noun","the brother","Mein Bruder ist älter. (My brother is older.)","family"],
  ["die","Schwester","noun","the sister","Meine Schwester lernt Deutsch. (My sister learns German.)","family"],
  ["der","Sohn","noun","the son","Der Sohn spielt Fußball. (The son plays football.)","family"],
  ["die","Tochter","noun","the daughter","Die Tochter liest ein Buch. (The daughter reads a book.)","family"],
  ["der","Freund","noun","the friend","Er ist mein Freund. (He is my friend.)","people"],
  ["der","Junge","noun","the boy","Der Junge spielt im Garten. (The boy plays in the garden.)","people"],
  ["das","Mädchen","noun","the girl","Das Mädchen singt schön. (The girl sings beautifully.)","people"],
  ["der","Mann","noun","the man","Der Mann trinkt Kaffee. (The man drinks coffee.)","people"],
  ["die","Frau","noun","the woman","Die Frau liest die Zeitung. (The woman reads the newspaper.)","people"],
  ["das","Kind","noun","the kid","Das Kind schläft schon. (The kid is already sleeping.)","people"],
  ["die","Verwandten","noun","the relatives","Meine Verwandten wohnen in Delhi. (My relatives live in Delhi.)","family"],
  ["die","Eltern","noun","the parents","Meine Eltern sind nett. (My parents are kind.)","family"],
  ["der","Großvater","noun","the grandfather","Mein Großvater ist alt. (My grandfather is old.)","family"],
  ["die","Großmutter","noun","the grandmother","Meine Großmutter kocht sehr gut. (My grandmother cooks very well.)","family"],
  ["die","Katze","noun","the cat","Die Katze schläft auf dem Sofa. (The cat sleeps on the sofa.)","people"],
  ["der","Hund","noun","the dog","Der Hund läuft schnell. (The dog runs fast.)","people"],
  ["der","Zucker","noun","the sugar","Ich nehme Zucker im Tee. (I take sugar in my tea.)","food"],
  ["das","Salz","noun","the salt","Gib mir bitte das Salz. (Please give me the salt.)","food"],
  ["die","Schokolade","noun","the chocolate","Ich esse gern Schokolade. (I like eating chocolate.)","food"],
  ["das","Gemüse","noun","the vegetables","Das Gemüse ist frisch. (The vegetables are fresh.)","food"],
  ["das","Obst","noun","the fruit","Ich esse jeden Tag Obst. (I eat fruit every day.)","food"],
  ["das","Getränk","noun","the drink","Was möchtest du als Getränk? (What would you like to drink?)","food"],
  ["die","Milch","noun","the milk","Ich trinke Milch am Morgen. (I drink milk in the morning.)","food"],
  ["das","Wasser","noun","the water","Ich trinke viel Wasser. (I drink a lot of water.)","food"],
  ["der","Tee","noun","the tea","Der Tee ist heiß. (The tea is hot.)","food"],
  ["der","Kaffee","noun","the coffee","Ich trinke jeden Morgen Kaffee. (I drink coffee every morning.)","food"],
  ["das","Fleisch","noun","the meat","Ich esse kein Fleisch. (I don't eat meat.)","food"],
  ["das","Ei","noun","the egg","Ich esse ein Ei zum Frühstück. (I eat an egg for breakfast.)","food"],
  ["der","Fisch","noun","the fish","Der Fisch schmeckt gut. (The fish tastes good.)","food"],
  ["der","Käse","noun","the cheese","Ich mag Käse. (I like cheese.)","food"],
  ["das","Brot","noun","the bread","Ich kaufe frisches Brot. (I buy fresh bread.)","food"],
  ["der","Salat","noun","the salad","Der Salat ist gesund. (The salad is healthy.)","food"],
  ["der","Kuchen","noun","the cake","Der Kuchen ist süß. (The cake is sweet.)","food"],
  ["das","Glas","noun","the glass","Das Glas ist voll. (The glass is full.)","tableware"],
  ["die","Flasche","noun","the bottle","Die Flasche ist leer. (The bottle is empty.)","tableware"],
  ["die","Tasse","noun","the cup","Die Tasse Kaffee ist heiß. (The cup of coffee is hot.)","tableware"],
  ["der","Teller","noun","the plate","Der Teller ist sauber. (The plate is clean.)","tableware"],
  ["der","Löffel","noun","the spoon","Ich brauche einen Löffel. (I need a spoon.)","tableware"],
  ["das","Gesicht","noun","the face","Sie hat ein freundliches Gesicht. (She has a friendly face.)","body"],
  ["die","Nase","noun","the nose","Meine Nase ist kalt. (My nose is cold.)","body"],
  ["die","Ohren","noun","the ears","Meine Ohren tun weh. (My ears hurt.)","body"],
  ["die","Augen","noun","the eyes","Sie hat schöne Augen. (She has beautiful eyes.)","body"],
  ["der","Mund","noun","the mouth","Mach den Mund auf. (Open your mouth.)","body"],
  ["die","Hand","noun","the hand","Gib mir deine Hand. (Give me your hand.)","body"],
  ["der","Fuß","noun","the foot","Mein Fuß tut weh. (My foot hurts.)","body"],
  ["die","Haare","noun","the hair","Ihre Haare sind lang. (Her hair is long.)","body"],
  ["die","Zähne","noun","the teeth","Putz deine Zähne. (Brush your teeth.)","body"],
  ["die","Hose","noun","the pants","Die Hose ist neu. (The pants are new.)","clothing"],
  ["das","Hemd","noun","the shirt","Das Hemd ist weiß. (The shirt is white.)","clothing"],
  ["die","Schuhe","noun","the shoes","Meine Schuhe sind schmutzig. (My shoes are dirty.)","clothing"],
  ["die","Socken","noun","the socks","Die Socken sind warm. (The socks are warm.)","clothing"],
  ["der","Pullover","noun","the sweater","Der Pullover ist weich. (The sweater is soft.)","clothing"],
  ["der","Rock","noun","the skirt","Der Rock ist bunt. (The skirt is colorful.)","clothing"],
  ["die","Schule","noun","the school","Die Kinder gehen zur Schule. (The children go to school.)","places"],
  ["das","Büro","noun","the office","Ich arbeite im Büro. (I work in the office.)","places"],
  ["der","Bahnhof","noun","the railway station","Wir treffen uns am Bahnhof. (We meet at the railway station.)","places"],
  ["der","Flughafen","noun","the airport","Der Flughafen ist weit weg. (The airport is far away.)","places"],
  ["die","Bushaltestelle","noun","the bus stop","Ich warte an der Bushaltestelle. (I wait at the bus stop.)","places"],
  ["der","Markt","noun","the market","Ich kaufe Obst auf dem Markt. (I buy fruit at the market.)","places"],
  ["das","Geschäft","noun","the store","Das Geschäft ist geöffnet. (The store is open.)","places"],
  ["die","Bibliothek","noun","the library","Ich lese Bücher in der Bibliothek. (I read books in the library.)","places"],
  ["der","Arzt","noun","the doctor","Der Arzt hilft den Patienten. (The doctor helps the patients.)","professions"],
  ["der","Lehrer","noun","the teacher","Der Lehrer erklärt gut. (The teacher explains well.)","professions"],
  ["der","Ingenieur","noun","the engineer","Der Ingenieur baut Brücken. (The engineer builds bridges.)","professions"],
  ["der","Bauer","noun","the farmer","Der Bauer arbeitet auf dem Feld. (The farmer works in the field.)","professions"],
  ["die","Hausfrau","noun","the housewife","Die Hausfrau kocht das Essen. (The housewife cooks the food.)","professions"],
  ["der","Kunde","noun","the customer","Der Kunde ist zufrieden. (The customer is satisfied.)","professions"],
  ["der","Kellner","noun","the waiter","Der Kellner bringt das Essen. (The waiter brings the food.)","professions"],
  ["","nur","adverb","only","Ich habe nur ein Buch. (I have only one book.)","adverb"],
  ["","jeder","adjective","each","Jeder Tag ist wichtig. (Each day is important.)","adjective"],
  ["","etwas","other","something","Ich möchte etwas essen. (I want to eat something.)","other"],
  ["","zusammen","adverb","together","Wir lernen zusammen. (We learn together.)","adverb"],
  ["","sofort","adverb","immediately","Komm sofort! (Come immediately!)","adverb"],
  ["","alle","other","all","Alle Kinder spielen. (All children play.)","other"],
  ["","jetzt","adverb","now","Ich arbeite jetzt. (I am working now.)","adverb"],
  ["","machen","verb","to do","Ich mache meine Hausaufgaben. (I do my homework.)","verb"],
  ["","wohnen","verb","to live","Ich wohne in Jaunpur. (I live in Jaunpur.)","verb"],
  ["","gehen","verb","to go","Ich gehe zur Schule. (I go to school.)","verb"],
  ["","kommen","verb","to come","Er kommt aus Indien. (He comes from India.)","verb"],
  ["","schlafen","verb","to sleep","Ich schlafe um zehn Uhr. (I sleep at ten o'clock.)","verb"],
  ["","baden","verb","to bathe","Ich bade jeden Morgen. (I bathe every morning.)","verb"],
  ["","kochen","verb","to cook","Meine Mutter kocht das Essen. (My mother cooks the food.)","verb"],
  ["","essen","verb","to eat","Wir essen zusammen. (We eat together.)","verb"],
  ["","trinken","verb","to drink","Ich trinke Wasser. (I drink water.)","verb"],
  ["","lesen","verb","to read","Ich lese ein Buch. (I read a book.)","verb"],
  ["","sprechen","verb","to speak","Ich spreche Deutsch. (I speak German.)","verb"],
  ["","sehen","verb","to see","Ich sehe einen Film. (I see a movie.)","verb"],
  ["","suchen","verb","to search","Ich suche meine Schlüssel. (I am searching for my keys.)","verb"],
  ["","fahren","verb","to drive","Ich fahre nach Berlin. (I am driving to Berlin.)","verb"],
  ["","reisen","verb","to travel","Ich reise gern. (I like to travel.)","verb"],
  ["","treffen","verb","to meet","Ich treffe meinen Freund. (I meet my friend.)","verb"],
  ["","bringen","verb","to bring","Bring mir das Buch. (Bring me the book.)","verb"],
  ["","fragen","verb","to ask","Ich frage den Lehrer. (I ask the teacher.)","verb"],
  ["","antworten","verb","to reply","Er antwortet schnell. (He replies quickly.)","verb"],
  ["","helfen","verb","to help","Ich helfe meiner Schwester. (I help my sister.)","verb"],
  ["","anfangen","verb","to begin","Die Schule fängt um acht an. (School begins at eight.)","verb"],
  ["","spielen","verb","to play","Die Kinder spielen im Garten. (The children play in the garden.)","verb"],
  ["","tanzen","verb","to dance","Wir tanzen gern. (We like to dance.)","verb"],
  ["","schwimmen","verb","to swim","Ich schwimme im Fluss. (I swim in the river.)","verb"],
  ["","singen","verb","to sing","Sie singt sehr schön. (She sings very beautifully.)","verb"],
  ["","einladen","verb","to invite","Ich lade dich ein. (I invite you.)","verb"],
  ["","lieben","verb","to love","Ich liebe meine Familie. (I love my family.)","verb"],
  ["","lachen","verb","to laugh","Wir lachen viel. (We laugh a lot.)","verb"],
  ["","sitzen","verb","to sit","Ich sitze auf dem Stuhl. (I sit on the chair.)","verb"],
  ["","anmachen","verb","to turn on","Mach das Licht an. (Turn on the light.)","verb"],
  ["","ausmachen","verb","to turn off","Mach das Licht aus. (Turn off the light.)","verb"],
  ["","geben","verb","to give","Ich gebe dir das Buch. (I give you the book.)","verb"],
  ["","nehmen","verb","to take","Ich nehme den Bus. (I take the bus.)","verb"],
  ["","denken","verb","to think","Ich denke an dich. (I think of you.)","verb"],
  ["","verstehen","verb","to understand","Ich verstehe die Frage. (I understand the question.)","verb"],
  ["","brauchen","verb","to need","Ich brauche Hilfe. (I need help.)","verb"],
  ["","bestellen","verb","to order","Ich bestelle Kaffee. (I order coffee.)","verb"],
  ["","lernen","verb","to learn","Ich lerne Deutsch. (I learn German.)","verb"],
  ["","heiraten","verb","to marry","Sie werden bald heiraten. (They will marry soon.)","verb"],
  ["","hören","verb","to listen","Ich höre Musik. (I listen to music.)","verb"],
  ["","schreiben","verb","to write","Ich schreibe einen Brief. (I write a letter.)","verb"],
  ["","laufen","verb","to run","Ich laufe jeden Morgen. (I run every morning.)","verb"],
  ["","schneiden","verb","to cut","Ich schneide das Brot. (I cut the bread.)","verb"],
  ["","vergessen","verb","to forget","Ich vergesse nichts. (I forget nothing.)","verb"],
  ["","erinnern","verb","to remember","Ich erinnere mich an dich. (I remember you.)","verb"],
  ["","besuchen","verb","to visit","Ich besuche meine Familie. (I visit my family.)","verb"],
  ["","feiern","verb","to celebrate","Wir feiern meinen Geburtstag. (We celebrate my birthday.)","verb"],
  ["","warten","verb","to wait","Ich warte auf den Bus. (I wait for the bus.)","verb"],
  ["","wissen","verb","to know","Ich weiß die Antwort. (I know the answer.)","verb"],
  ["","kennen","verb","to know (someone)","Ich kenne ihn gut. (I know him well.)","verb"],
  ["","schließen","verb","to shut down","Ich schließe die Tür. (I close the door.)","verb"],
  ["","öffnen","verb","to open","Ich öffne das Fenster. (I open the window.)","verb"],
  ["","denken","verb","to think","Ich denke an dich. (I think of you.)","verb"],
  ["","bezahlen","verb","to pay","Ich bezahle die Rechnung. (I pay the bill.)","verb"],
  ["","verkaufen","verb","to sell","Er verkauft sein Auto. (He sells his car.)","verb"],
  ["","kaufen","verb","to buy","Ich kaufe ein Buch. (I buy a book.)","verb"],
  ["","sagen","verb","to say","Was sagst du? (What do you say?)","verb"],
  ["","versuchen","verb","to try","Ich versuche es noch einmal. (I try it once more.)","verb"],
  ["","unterrichten","verb","to teach","Er unterrichtet Deutsch. (He teaches German.)","verb"],
  ["","drücken","verb","to press","Drück den Knopf. (Press the button.)","verb"],
  ["","zeichnen","verb","to draw","Ich zeichne ein Bild. (I draw a picture.)","verb"],
  ["","arbeiten","verb","to work","Ich arbeite jeden Tag. (I work every day.)","verb"],
  ["","Montag","noun","Monday","Am Montag gehe ich arbeiten. (On Monday I go to work.)","calendar"],
  ["","Dienstag","noun","Tuesday","Dienstag ist mein freier Tag. (Tuesday is my day off.)","calendar"],
  ["","Mittwoch","noun","Wednesday","Mittwoch lerne ich Deutsch. (On Wednesday I learn German.)","calendar"],
  ["","Donnerstag","noun","Thursday","Am Donnerstag regnet es. (On Thursday it rains.)","calendar"],
  ["","Freitag","noun","Friday","Freitag ist der letzte Arbeitstag. (Friday is the last workday.)","calendar"],
  ["","Samstag","noun","Saturday","Am Samstag schlafe ich lange. (On Saturday I sleep late.)","calendar"],
  ["","Sonntag","noun","Sunday","Sonntag ist ein Ruhetag. (Sunday is a rest day.)","calendar"],
  ["","Januar","noun","January","Im Januar ist es kalt. (In January it is cold.)","calendar"],
  ["","Februar","noun","February","Der Februar ist kurz. (February is short.)","calendar"],
  ["","März","noun","March","Im März beginnt der Frühling. (In March spring begins.)","calendar"],
  ["","April","noun","April","Im April regnet es oft. (In April it often rains.)","calendar"],
  ["","Mai","noun","May","Im Mai blühen die Blumen. (In May the flowers bloom.)","calendar"],
  ["","Juni","noun","June","Der Juni ist warm. (June is warm.)","calendar"],
  ["","Juli","noun","July","Im Juli fahre ich in Urlaub. (In July I go on holiday.)","calendar"],
  ["","August","noun","August","Der August ist sehr heiß. (August is very hot.)","calendar"],
  ["","September","noun","September","Im September beginnt die Schule. (In September school starts.)","calendar"],
  ["","Oktober","noun","October","Im Oktober werden die Blätter bunt. (In October the leaves turn colorful.)","calendar"],
  ["","November","noun","November","Der November ist grau. (November is grey.)","calendar"],
  ["","Dezember","noun","December","Im Dezember feiern wir Weihnachten. (In December we celebrate Christmas.)","calendar"],
  ["","Jahreszeiten","noun","seasons","Es gibt vier Jahreszeiten. (There are four seasons.)","calendar"],
  ["der","Frühling","noun","spring","Im Frühling wird es warm. (In spring it becomes warm.)","calendar"],
  ["der","Sommer","noun","summer","Der Sommer ist heiß. (Summer is hot.)","calendar"],
  ["der","Herbst","noun","autumn","Im Herbst fallen die Blätter. (In autumn the leaves fall.)","calendar"],
  ["der","Winter","noun","winter","Der Winter ist kalt. (Winter is cold.)","calendar"],
  ["der","Geburtstag","noun","the birthday","Heute ist mein Geburtstag. (Today is my birthday.)","calendar"],
  ["der","Urlaub","noun","the holiday","Wir fahren in den Urlaub. (We go on holiday.)","calendar"],
  ["das","Heute","noun","today","Heute ist Montag. (Today is Monday.)","time"],
  ["das","Morgen","noun","tomorrow","Morgen fahre ich nach Berlin. (Tomorrow I travel to Berlin.)","time"],
  ["das","Gestern","noun","yesterday","Gestern war ich krank. (Yesterday I was sick.)","time"],
  ["","rot","adjective","red","Das Auto ist rot. (The car is red.)","adjective"],
  ["","gelb","adjective","yellow","Die Sonne ist gelb. (The sun is yellow.)","adjective"],
  ["","blau","adjective","blue","Der Himmel ist blau. (The sky is blue.)","adjective"],
  ["","weiß","adjective","white","Das Hemd ist weiß. (The shirt is white.)","adjective"],
  ["","schwarz","adjective","black","Die Katze ist schwarz. (The cat is black.)","adjective"],
  ["","grau","adjective","gray","Der Himmel ist grau. (The sky is gray.)","adjective"],
  ["","grün","adjective","green","Das Gras ist grün. (The grass is green.)","adjective"],
  ["","violett","adjective","violet","Die Blume ist violett. (The flower is violet.)","adjective"],
  ["","rosa","adjective","pink","Der Rock ist rosa. (The skirt is pink.)","adjective"],
  ["","braun","adjective","brown","Die Haare sind braun. (The hair is brown.)","adjective"],
  ["","dunkel","adjective","dark","Das Zimmer ist dunkel. (The room is dark.)","adjective"],
  ["","hell","adjective","bright","Das Licht ist hell. (The light is bright.)","adjective"],
  ["die","Idee","noun","the idea","Das ist eine gute Idee. (That is a good idea.)","other"],
  ["das","Angebot","noun","the offer","Das Angebot ist günstig. (The offer is cheap.)","other"],
  ["die","Rechnung","noun","the bill","Kann ich die Rechnung haben? (Can I have the bill?)","other"],
  ["der","Aufzug","noun","the elevator","Wir nehmen den Aufzug. (We take the elevator.)","other"],
  ["die","Treppe","noun","the stairs","Ich gehe die Treppe hoch. (I go up the stairs.)","other"],
  ["","neu","adjective","new","Mein Handy ist neu. (My phone is new.)","adjective"],
  ["","alt","adjective","old","Das Buch ist alt. (The book is old.)","adjective"],
  ["","gut","adjective","good","Das Essen ist gut. (The food is good.)","adjective"],
  ["","schlecht","adjective","bad","Das Wetter ist schlecht. (The weather is bad.)","adjective"],
  ["","krank","adjective","sick","Ich bin krank. (I am sick.)","adjective"],
  ["","heiß","adjective","hot","Der Tee ist heiß. (The tea is hot.)","adjective"],
  ["","kalt","adjective","cold","Das Wasser ist kalt. (The water is cold.)","adjective"],
  ["","groß","adjective","big","Das Haus ist groß. (The house is big.)","adjective"],
  ["","klein","adjective","small","Das Zimmer ist klein. (The room is small.)","adjective"],
  ["","glücklich","adjective","happy","Ich bin glücklich. (I am happy.)","adjective"],
  ["","traurig","adjective","sad","Sie ist traurig. (She is sad.)","adjective"],
  ["","schön","adjective","beautiful","Der Garten ist schön. (The garden is beautiful.)","adjective"],
  ["","hässlich","adjective","ugly","Das Bild ist hässlich. (The picture is ugly.)","adjective"],
  ["","schnell","adjective","fast","Das Auto ist schnell. (The car is fast.)","adjective"],
  ["","langsam","adjective","slow","Die Schildkröte ist langsam. (The turtle is slow.)","adjective"],
  ["","einfach","adjective","easy","Die Aufgabe ist einfach. (The task is easy.)","adjective"],
  ["","schwierig","adjective","difficult","Die Prüfung ist schwierig. (The exam is difficult.)","adjective"],
  ["","sanft","adjective","soft","Das Kissen ist sanft. (The pillow is soft.)","adjective"],
  ["","schwer","adjective","hard","Die Tasche ist schwer. (The bag is heavy/hard.)","adjective"],
  ["","früh","adverb","early","Ich stehe früh auf. (I get up early.)","adverb"],
  ["","spät","adverb","late","Er kommt immer spät. (He always comes late.)","adverb"],
  ["","frisch","adjective","fresh","Das Brot ist frisch. (The bread is fresh.)","adjective"],
  ["","immer","adverb","always","Ich lerne immer Deutsch. (I always learn German.)","adverb"],
  ["","nie","adverb","never","Ich rauche nie. (I never smoke.)","adverb"],
  ["","manchmal","adverb","sometimes","Manchmal koche ich selbst. (Sometimes I cook myself.)","adverb"],
  ["die", "Sekunde", "noun", "the second", "Die Sekunde ist hier. (The second is here.)", "time"],
  ["die", "Minute", "noun", "the minute", "Die Minute ist hier. (The minute is here.)", "time"],
  ["die", "Stunde", "noun", "the hour", "Die Stunde ist hier. (The hour is here.)", "time"],
  ["der", "Tag", "noun", "the day", "Der Tag ist hier. (The day is here.)", "time"],
  ["die", "Woche", "noun", "the week", "Die Woche ist hier. (The week is here.)", "time"],
  ["das", "Jahr", "noun", "the year", "Das Jahr ist hier. (The year is here.)", "time"],
  ["der", "Wochentag", "noun", "the day of the week", "Der Wochentag ist hier. (The day of the week is here.)", "time"],
  ["der", "Sonntag", "noun", "the Sunday", "Der Sonntag ist hier. (The Sunday is here.)", "calendar"],
  ["der", "Montag", "noun", "the Monday", "Der Montag ist hier. (The Monday is here.)", "calendar"],
  ["der", "Dienstag", "noun", "the Tuesday", "Der Dienstag ist hier. (The Tuesday is here.)", "calendar"],
  ["der", "Mittwoch", "noun", "the Wednesday", "Der Mittwoch ist hier. (The Wednesday is here.)", "calendar"],
  ["der", "Donnerstag", "noun", "the Thursday", "Der Donnerstag ist hier. (The Thursday is here.)", "calendar"],
  ["der", "Freitag", "noun", "the Friday", "Der Freitag ist hier. (The Friday is here.)", "calendar"],
  ["der", "Samstag", "noun", "the Saturday", "Der Samstag ist hier. (The Saturday is here.)", "calendar"],
  ["das", "Wochenende", "noun", "the weekend", "Das Wochenende ist hier. (The weekend is here.)", "time"],
  ["", "am Wochenende", "other", "at the weekend", "'am Wochenende' bedeutet 'at the weekend'. ('am Wochenende' means 'at the weekend'.)", "time"],
  ["der", "Morgen", "noun", "the morning", "Der Morgen ist hier. (The morning is here.)", "time"],
  ["der", "Vormittag", "noun", "the forenoon", "Der Vormittag ist hier. (The forenoon is here.)", "time"],
  ["der", "Mittag", "noun", "the noon", "Der Mittag ist hier. (The noon is here.)", "time"],
  ["der", "Nachmittag", "noun", "the afternoon", "Der Nachmittag ist hier. (The afternoon is here.)", "time"],
  ["der", "Abend", "noun", "the evening", "Der Abend ist hier. (The evening is here.)", "time"],
  ["die", "Nacht", "noun", "the night", "Die Nacht ist hier. (The night is here.)", "time"],
  ["der", "Januar", "noun", "January", "Der Januar ist hier. (January is here.)", "calendar"],
  ["der", "Februar", "noun", "February", "Der Februar ist hier. (February is here.)", "calendar"],
  ["der", "März", "noun", "March", "Der März ist hier. (March is here.)", "calendar"],
  ["der", "April", "noun", "April", "Der April ist hier. (April is here.)", "calendar"],
  ["der", "Mai", "noun", "May", "Der Mai ist hier. (May is here.)", "calendar"],
  ["der", "Juni", "noun", "June", "Der Juni ist hier. (June is here.)", "calendar"],
  ["der", "Juli", "noun", "July", "Der Juli ist hier. (July is here.)", "calendar"],
  ["der", "August", "noun", "August", "Der August ist hier. (August is here.)", "calendar"],
  ["der", "September", "noun", "September", "Der September ist hier. (September is here.)", "calendar"],
  ["der", "Oktober", "noun", "October", "Der Oktober ist hier. (October is here.)", "calendar"],
  ["der", "November", "noun", "November", "Der November ist hier. (November is here.)", "calendar"],
  ["der", "Dezember", "noun", "December", "Der Dezember ist hier. (December is here.)", "calendar"],
  ["der", "Frühling", "noun", "the spring", "Der Frühling ist hier. (The spring is here.)", "calendar"],
  ["der", "Sommer", "noun", "the summer", "Der Sommer ist hier. (The summer is here.)", "calendar"],
  ["der", "Herbst", "noun", "the autumn", "Der Herbst ist hier. (The autumn is here.)", "calendar"],
  ["der", "Winter", "noun", "the winter", "Der Winter ist hier. (The winter is here.)", "calendar"],
  ["die", "Farben", "noun", "colours", "Die Farben ist hier. (Colours is here.)", "other"],
  ["", "schwarz", "adjective", "black", "Das ist sehr schwarz. (That is very black.)", "adjective"],
  ["", "weiß", "adjective", "white", "Das ist sehr weiß. (That is very white.)", "adjective"],
  ["", "grau", "adjective", "grey", "Das ist sehr grau. (That is very grey.)", "adjective"],
  ["", "blau", "adjective", "blue", "Das ist sehr blau. (That is very blue.)", "adjective"],
  ["", "grün", "adjective", "green", "Das ist sehr grün. (That is very green.)", "adjective"],
  ["", "rot", "adjective", "red", "Das ist sehr rot. (That is very red.)", "adjective"],
  ["", "gelb", "adjective", "yellow", "Das ist sehr gelb. (That is very yellow.)", "adjective"],
  ["", "braun", "adjective", "brown", "Das ist sehr braun. (That is very brown.)", "adjective"],
  ["", "Deutschland", "other", "Germany", "'Deutschland' bedeutet 'Germany'. ('Deutschland' means 'Germany'.)", "other"],
  ["", "deutsch", "adjective", "German", "Das ist sehr deutsch. (That is very German.)", "adjective"],
  ["", "Europa", "other", "Europe", "'Europa' bedeutet 'Europe'. ('Europa' means 'Europe'.)", "other"],
  ["", "Europäer", "other", "European", "'Europäer' bedeutet 'European'. ('Europäer' means 'European'.)", "other"],
  ["", "europäisch", "adjective", "European", "Das ist sehr europäisch. (That is very European.)", "adjective"],
  ["", "Himmelsrichtungen", "verb", "directions", "Ich möchte Himmelsrichtungen. (I would like to directions.)", "verb"],
  ["der", "Norden", "noun", "the north", "Der Norden ist hier. (The north is here.)", "other"],
  ["der", "Süden", "noun", "the south", "Der Süden ist hier. (The south is here.)", "other"],
  ["der", "Westen", "noun", "the west", "Der Westen ist hier. (The west is here.)", "other"],
  ["der", "Osten", "noun", "the east", "Der Osten ist hier. (The east is here.)", "other"],
  ["", "ab", "other", "from", "Der Zug fährt ab acht Uhr. (The train leaves from eight o'clock.)", "other"],
  ["", "aber", "other", "but", "Ich bin müde, aber glücklich. (I am tired, but happy.)", "other"],
  ["", "abfahren", "verb", "leave", "Ich möchte abfahren. (I would like to leave.)", "verb"],
  ["die", "Abfahrt", "noun", "the departure", "Die Abfahrt ist hier. (The departure is here.)", "transport"],
  ["", "abgeben", "verb", "to hand over", "Ich möchte abgeben. (I would like to hand over.)", "verb"],
  ["", "abholen", "verb", "to pick up", "Ich möchte abholen. (I would like to pick up.)", "verb"],
  ["der", "Absender", "noun", "the sender", "Der Absender ist hier. (The sender is here.)", "other"],
  ["", "Achtung", "other", "attention. Danger!", "'Achtung' bedeutet 'attention. Danger!'. ('Achtung' means 'attention. Danger!'.)", "other"],
  ["die", "Adresse", "noun", "the address", "Die Adresse ist hier. (The address is here.)", "other"],
  ["", "allein", "adjective", "alone", "Das ist sehr allein. (That is very alone.)", "adjective"],
  ["", "also", "adverb", "so", "Also, was machen wir jetzt? (So, what do we do now?)", "adverb"],
  ["", "alt", "adjective", "old", "Das ist sehr alt. (That is very old.)", "adjective"],
  ["das", "Alter", "noun", "the age", "Das Alter ist hier. (The age is here.)", "other"],
  ["", "anbieten", "verb", "offer", "Ich möchte anbieten. (I would like to offer.)", "verb"],
  ["das", "Angebot", "noun", "offer", "Das Angebot ist hier. (Offer is here.)", "other"],
  ["", "ander", "adjective", "other", "Das ist sehr ander. (That is very other.)", "adjective"],
  ["", "anfangen", "verb", "start", "Ich möchte anfangen. (I would like to start.)", "verb"],
  ["der", "Anfang", "noun", "the beginning", "Der Anfang ist hier. (The beginning is here.)", "other"],
  ["", "anklicken", "verb", "to click", "Ich möchte anklicken. (I would like to click.)", "verb"],
  ["", "ankommen", "verb", "arrive", "Ich möchte ankommen. (I would like to arrive.)", "verb"],
  ["die", "Ankunft", "noun", "the arrival", "Die Ankunft ist hier. (The arrival is here.)", "transport"],
  ["", "ankreuzen", "verb", "to tick", "Ich möchte ankreuzen. (I would like to tick.)", "verb"],
  ["", "anmachen", "verb", "to turn on", "Ich möchte anmachen. (I would like to turn on.)", "verb"],
  ["", "anmelden", "verb", "to register", "Ich anmelden mich. (I register myself.)", "verb"],
  ["die", "Anmeldung", "noun", "the registration", "Die Anmeldung ist hier. (The registration is here.)", "other"],
  ["die", "Anrede", "noun", "the salutation", "Die Anrede ist hier. (The salutation is here.)", "other"],
  ["", "anrufen", "verb", "to call", "Ich möchte anrufen. (I would like to call.)", "verb"],
  ["der", "Anruf", "noun", "the call", "Der Anruf ist hier. (The call is here.)", "other"],
  ["der", "Anrufbeantworter", "noun", "the answering machine", "Der Anrufbeantworter ist hier. (The answering machine is here.)", "other"],
  ["die", "Ansage", "noun", "the announcement", "Die Ansage ist hier. (The announcement is here.)", "other"],
  ["der", "Anschluss", "noun", "the connection", "Der Anschluss ist hier. (The connection is here.)", "other"],
  ["", "an sein", "verb", "to be on", "Das Licht ist an. (The light is on.)", "verb"],
  ["", "antworten", "verb", "to answer", "Ich möchte antworten. (I would like to answer.)", "verb"],
  ["die", "Antwort", "noun", "the answer", "Die Antwort ist hier. (The answer is here.)", "other"],
  ["die", "Anzeige", "noun", "the advertisement", "Die Anzeige ist hier. (The advertisement is here.)", "other"],
  ["", "anziehen", "verb", "to put on", "Ich möchte anziehen. (I would like to put on.)", "verb"],
  ["das", "Apartment", "noun", "apartment", "Das Apartment ist hier. (Apartment is here.)", "places"],
  ["der", "Apfel", "noun", "the apple", "Der Apfel ist hier. (The apple is here.)", "food"],
  ["der", "Appetit", "noun", "the appetite", "Der Appetit ist hier. (The appetite is here.)", "food"],
  ["", "arbeiten", "verb", "to work", "Ich möchte arbeiten. (I would like to work.)", "verb"],
  ["die", "Arbeit", "noun", "the work", "Die Arbeit ist hier. (The work is here.)", "other"],
  ["", "arbeitslos", "adjective", "unemployed", "Das ist sehr arbeitslos. (That is very unemployed.)", "adjective"],
  ["der", "Arbeitsplatz", "noun", "job", "Der Arbeitsplatz ist hier. (Job is here.)", "professions"],
  ["der", "Arm", "noun", "poor", "Der Arm ist hier. (Poor is here.)", "body"],
  ["der", "Arzt", "noun", "the doctor", "Der Arzt ist hier. (The doctor is here.)", "professions"],
  ["", "auch", "adverb", "also", "Ich lerne auch Englisch. (I also learn English.)", "adverb"],
  ["", "auf", "other", "on", "Das Buch liegt auf dem Tisch. (The book lies on the table.)", "other"],
  ["die", "Aufgabe", "noun", "the task", "Die Aufgabe ist hier. (The task is here.)", "other"],
  ["", "aufhören", "verb", "to stop", "Ich möchte aufhören. (I would like to stop.)", "verb"],
  ["", "auf sein", "verb", "to be open", "Die Tür ist auf. (The door is open.)", "verb"],
  ["", "aufstehen", "verb", "to get up", "Ich möchte aufstehen. (I would like to get up.)", "verb"],
  ["der", "Aufzug", "noun", "the elevator", "Der Aufzug ist hier. (The elevator is here.)", "other"],
  ["das", "Auge", "noun", "the eye", "Das Auge ist hier. (The eye is here.)", "body"],
  ["", "aus", "other", "from / out of", "Ich komme aus Indien. (I come from India.)", "other"],
  ["der", "Ausflug", "noun", "the excursion", "Der Ausflug ist hier. (The excursion is here.)", "other"],
  ["", "ausfüllen", "verb", "fill in", "Ich möchte ausfüllen. (I would like to fill in.)", "verb"],
  ["der", "Ausgang", "noun", "the exit", "Der Ausgang ist hier. (The exit is here.)", "other"],
  ["die", "Auskunft", "noun", "the information", "Die Auskunft ist hier. (The information is here.)", "other"],
  ["das", "Ausland", "noun", "abroad", "Das Ausland ist hier. (Abroad is here.)", "other"],
  ["der", "Ausländer", "noun", "foreigners", "Der Ausländer ist hier. (Foreigners is here.)", "other"],
  ["", "ausländisch", "adjective", "foreign", "Das ist sehr ausländisch. (That is very foreign.)", "adjective"],
  ["", "ausmachen", "verb", "to turn off", "Ich möchte ausmachen. (I would like to turn off.)", "verb"],
  ["die", "Aussage", "noun", "the statement", "Die Aussage ist hier. (The statement is here.)", "other"],
  ["", "aussehen", "verb", "to look", "Ich möchte aussehen. (I would like to look.)", "verb"],
  ["", "aus sein", "verb", "to be off", "Der Fernseher ist aus. (The TV is off.)", "verb"],
  ["", "aussteigen", "verb", "to get out", "Ich möchte aussteigen. (I would like to get out.)", "verb"],
  ["der", "Ausweis", "noun", "the ID card", "Der Ausweis ist hier. (The ID card is here.)", "other"],
  ["", "ausziehen", "verb", "to take off", "Ich ausziehen mich. (I take off myself.)", "verb"],
  ["das", "Auto", "noun", "the car", "Das Auto ist hier. (The car is here.)", "transport"],
  ["die", "Autobahn", "noun", "the motorway", "Die Autobahn ist hier. (The motorway is here.)", "transport"],
  ["der", "Automat", "noun", "the machine", "Der Automat ist hier. (The machine is here.)", "electronics"],
  ["", "automatisch", "adjective", "automatically", "Das ist sehr automatisch. (That is very automatically.)", "adjective"],
  ["das", "Baby", "noun", "the baby", "Das Baby ist hier. (The baby is here.)", "family"],
  ["die", "Backerei", "noun", "the bakery", "Die Backerei ist hier. (The bakery is here.)", "other"],
  ["das", "Bad", "noun", "the bath", "Das Bad ist hier. (The bath is here.)", "house"],
  ["", "baden", "verb", "to bathe", "Ich möchte baden. (I would like to bathe.)", "verb"],
  ["die", "Bahn", "noun", "the train", "Die Bahn ist hier. (The train is here.)", "transport"],
  ["der", "Bahnhof", "noun", "the train station", "Der Bahnhof ist hier. (The train station is here.)", "transport"],
  ["der", "Bahnsteig", "noun", "the platform", "Der Bahnsteig ist hier. (The platform is here.)", "transport"],
  ["", "bald", "adverb", "soon", "Er kommt bald. (He comes soon.)", "adverb"],
  ["der", "Balkon", "noun", "the balcony", "Der Balkon ist hier. (The balcony is here.)", "house"],
  ["die", "Banane", "noun", "the banana", "Die Banane ist hier. (The banana is here.)", "food"],
  ["die", "Bank", "noun", "the bank", "Die Bank ist hier. (The bank is here.)", "places"],
  ["", "bar", "other", "cash", "'bar' bedeutet 'cash'. ('bar' means 'cash'.)", "other"],
  ["der", "Bauch", "noun", "the belly", "Der Bauch ist hier. (The belly is here.)", "body"],
  ["der", "Baum", "noun", "the tree", "Der Baum ist hier. (The tree is here.)", "other"],
  ["der", "Beamte", "noun", "the official", "Der Beamte ist hier. (The official is here.)", "people"],
  ["", "bedeuten", "verb", "to matter /to mean", "Ich möchte bedeuten. (I would like to matter /mean.)", "verb"],
  ["", "beginnen", "verb", "to start", "Ich möchte beginnen. (I would like to start.)", "verb"],
  ["", "bei", "other", "at", "Ich wohne bei meiner Familie. (I live with my family.)", "other"],
  ["", "beide", "other", "both", "'beide' bedeutet 'both'. ('beide' means 'both'.)", "other"],
  ["das", "Bein", "noun", "the leg", "Das Bein ist hier. (The leg is here.)", "body"],
  ["das", "Beispiel", "noun", "the example", "Das Beispiel ist hier. (The example is here.)", "other"],
  ["", "zum Beispiel", "other", "for example", "'zum Beispiel' bedeutet 'for example'. ('zum Beispiel' means 'for example'.)", "other"],
  ["", "bekannt", "adjective", "known", "Das ist sehr bekannt. (That is very known.)", "adjective"],
  ["der", "Bekannte", "noun", "the acquaintance", "Der Bekannte ist hier. (The acquaintance is here.)", "people"],
  ["", "bekommen", "verb", "get", "Ich möchte bekommen. (I would like to get.)", "verb"],
  ["", "benutzen", "verb", "use", "Ich möchte benutzen. (I would like to use.)", "verb"],
  ["der", "Beruf", "noun", "occupation", "Der Beruf ist hier. (Occupation is here.)", "professions"],
  ["", "besetzt", "adjective", "occupied", "Das ist sehr besetzt. (That is very occupied.)", "adjective"],
  ["", "besichtigen", "verb", "to survey", "Ich möchte besichtigen. (I would like to survey.)", "verb"],
  ["", "besser", "adjective", "better", "Das ist sehr besser. (That is very better.)", "adjective"],
  ["", "best", "adjective", "best", "Das ist sehr best. (That is very best.)", "adjective"],
  ["", "bestellen", "verb", "order", "Ich möchte bestellen. (I would like to order.)", "verb"],
  ["", "besuchen", "verb", "to visit", "Ich möchte besuchen. (I would like to visit.)", "verb"],
  ["das", "Bett", "noun", "the bed", "Das Bett ist hier. (The bed is here.)", "furniture"],
  ["", "bezahlen", "verb", "to pay", "Ich möchte bezahlen. (I would like to pay.)", "verb"],
  ["das", "Bier", "noun", "the beer", "Das Bier ist hier. (The beer is here.)", "food"],
  ["das", "Bild", "noun", "the picture", "Das Bild ist hier. (The picture is here.)", "other"],
  ["", "billig", "adjective", "cheap", "Das ist sehr billig. (That is very cheap.)", "adjective"],
  ["die", "Birne", "noun", "the pear", "Die Birne ist hier. (The pear is here.)", "food"],
  ["", "bis", "other", "until", "Ich warte bis morgen. (I wait until tomorrow.)", "other"],
  ["", "bisschen", "adverb", "a little", "Er kommt bisschen. (He comes a little.)", "adverb"],
  ["", "bitte", "adverb", "please", "Ein Kaffee, bitte. (One coffee, please.)", "adverb"],
  ["die", "Bitte", "noun", "the request", "Ein Kaffee, bitte. (One coffee, please.)", "other"],
  ["", "bitten", "verb", "to request", "Ich möchte bitten. (I would like to request.)", "verb"],
  ["", "bitter", "adjective", "bitter", "Das ist sehr bitter. (That is very bitter.)", "adjective"],
  ["", "bleiben", "verb", "to stay", "Ich möchte bleiben. (I would like to stay.)", "verb"],
  ["der", "Bleistift", "noun", "the pencil", "Der Bleistift ist hier. (The pencil is here.)", "other"],
  ["der", "Blick", "noun", "glimpse", "Der Blick ist hier. (Glimpse is here.)", "other"],
  ["die", "Blume", "noun", "the flower", "Die Blume ist hier. (The flower is here.)", "other"],
  ["der", "Bogen", "noun", "the bow", "Der Bogen ist hier. (The bow is here.)", "other"],
  ["", "böse", "adjective", "naughty /wicked /bad", "Das ist sehr böse. (That is very naughty /wicked /bad.)", "adjective"],
  ["", "brauchen", "verb", "need", "Ich möchte brauchen. (I would like to need.)", "verb"],
  ["", "breit", "adjective", "wide", "Das ist sehr breit. (That is very wide.)", "adjective"],
  ["der", "Brief", "noun", "the letter", "Der Brief ist hier. (The letter is here.)", "other"],
  ["die", "Briefmarke", "noun", "the stamp", "Die Briefmarke ist hier. (The stamp is here.)", "other"],
  ["", "bringen", "verb", "to bring", "Ich möchte bringen. (I would like to bring.)", "verb"],
  ["das", "Brot", "noun", "the bread", "Das Brot ist hier. (The bread is here.)", "food"],
  ["das", "Brötchen", "noun", "small bread", "Das Brötchen ist hier. (Small bread is here.)", "food"],
  ["der", "Bruder", "noun", "the brother", "Der Bruder ist hier. (The brother is here.)", "family"],
  ["das", "Buch", "noun", "the book", "Das Buch ist hier. (The book is here.)", "other"],
  ["der", "Buchstabe", "noun", "alphabet", "Der Buchstabe ist hier. (Alphabet is here.)", "other"],
  ["", "buchstabieren", "verb", "to spell", "Ich möchte buchstabieren. (I would like to spell.)", "verb"],
  ["der", "Bus", "noun", "the bus", "Der Bus ist hier. (The bus is here.)", "transport"],
  ["die", "Butter", "noun", "the butter", "Die Butter ist hier. (The butter is here.)", "food"],
  ["das", "Café", "noun", "the cafe", "Das Café ist hier. (The cafe is here.)", "places"],
  ["die", "CD", "noun", "the CD", "Die CD ist hier. (The CD is here.)", "other"],
  ["der", "Chef", "noun", "the boss", "Der Chef ist hier. (The boss is here.)", "professions"],
  ["", "circa", "adjective", "approx", "Das ist sehr circa. (That is very approx.)", "adjective"],
  ["der", "Computer", "noun", "the computer", "Der Computer ist hier. (The computer is here.)", "electronics"],
  ["", "da", "other", "there/because", "'da' bedeutet 'there/because'. ('da' means 'there/because'.)", "other"],
  ["die", "Dame", "noun", "the lady", "Die Dame ist hier. (The lady is here.)", "people"],
  ["", "daneben", "verb", "beside", "Ich möchte daneben. (I would like to beside.)", "verb"],
  ["", "danken", "verb", "to thank", "Ich möchte danken. (I would like to thank.)", "verb"],
  ["der", "Dank", "noun", "the thank you", "Der Dank ist hier. (The thank you is here.)", "other"],
  ["", "danke", "other", "thank you", "Danke für deine Hilfe! (Thanks for your help!)", "other"],
  ["", "dann", "adverb", "then", "Er kommt dann. (He comes then.)", "adverb"],
  ["das", "Datum", "noun", "the date", "Das Datum ist hier. (The date is here.)", "calendar"],
  ["", "dauern", "verb", "to last/to continue", "Ich möchte dauern. (I would like to last/continue.)", "verb"],
  ["", "dein", "other", "your", "Das ist dein Stift. (That is your pen.)", "other"],
  ["", "denn", "other", "because", "Ich bin müde, denn ich habe viel gearbeitet. (I am tired, because I worked a lot.)", "other"],
  ["", "der,die,das", "other", "the", "'der,die,das' bedeutet 'the'. ('der,die,das' means 'the'.)", "other"],
  ["", "dich", "other", "you", "Ich sehe dich. (I see you.)", "other"],
  ["", "dies", "other", "this", "Dies ist mein Haus. (This is my house.)", "other"],
  ["", "dir", "other", "you", "Das gehört dir. (That belongs to you.)", "other"],
  ["die", "Disco", "noun", "the disco", "Die Disco ist hier. (The disco is here.)", "places"],
  ["der", "Doktor", "noun", "the doctor", "Der Doktor ist hier. (The doctor is here.)", "other"],
  ["das", "Doppelzimmer", "noun", "the double room", "Das Doppelzimmer ist hier. (The double room is here.)", "house"],
  ["das", "Dorf", "noun", "the village", "Das Dorf ist hier. (The village is here.)", "house"],
  ["", "dort", "adverb", "there", "Er kommt dort. (He comes there.)", "adverb"],
  ["", "draußen", "adverb", "outside", "Er kommt draußen. (He comes outside.)", "adverb"],
  ["", "drucken", "verb", "print", "Ich möchte drucken. (I would like to print.)", "verb"],
  ["der", "Drucker", "noun", "the printer", "Der Drucker ist hier. (The printer is here.)", "electronics"],
  ["", "drücken", "verb", "to push", "Ich möchte drücken. (I would like to push.)", "verb"],
  ["", "durch", "other", "through", "Wir gehen durch den Park. (We walk through the park.)", "other"],
  ["die", "Durchsage", "noun", "the announcement", "Die Durchsage ist hier. (The announcement is here.)", "other"],
  ["", "dürfen", "verb", "may", "Hier darf man rauchen. (One may smoke here.)", "verb"],
  ["der", "Durst", "noun", "the thirst", "Der Durst ist hier. (The thirst is here.)", "food"],
  ["", "duschen", "verb", "to shower", "Ich duschen mich. (I shower myself.)", "verb"],
  ["die", "Dusche", "noun", "the shower", "Die Dusche ist hier. (The shower is here.)", "house"],
  ["die", "Ecke", "noun", "the corner", "Die Ecke ist hier. (The corner is here.)", "other"],
  ["die", "Ehefrau", "noun", "the wife", "Die Ehefrau ist hier. (The wife is here.)", "family"],
  ["der", "Ehemann", "noun", "the husband", "Der Ehemann ist hier. (The husband is here.)", "family"],
  ["das", "Ei", "noun", "the egg", "Das Ei ist hier. (The egg is here.)", "food"],
  ["", "eilig", "adjective", "urgent", "Das ist sehr eilig. (That is very urgent.)", "adjective"],
  ["", "ein", "other", "a", "'ein' bedeutet 'a'. ('ein' means 'a'.)", "other"],
  ["", "einfach", "adjective", "simple", "Das ist sehr einfach. (That is very simple.)", "adjective"],
  ["der", "Eingang", "noun", "the entrance", "Der Eingang ist hier. (The entrance is here.)", "other"],
  ["", "einkaufen", "verb", "shopping", "Ich möchte einkaufen. (I would like to shopping.)", "verb"],
  ["", "einladen", "verb", "invite", "Ich möchte einladen. (I would like to invite.)", "verb"],
  ["die", "Einladung", "noun", "the invitation", "Die Einladung ist hier. (The invitation is here.)", "other"],
  ["", "einmal", "adverb", "once", "Er kommt einmal. (He comes once.)", "adverb"],
  ["", "einsteigen", "verb", "get in", "Ich möchte einsteigen. (I would like to get in.)", "verb"],
  ["der", "Eintritt", "noun", "the entrance", "Der Eintritt ist hier. (The entrance is here.)", "other"],
  ["das", "Einzelzimmer", "noun", "the single room", "Das Einzelzimmer ist hier. (The single room is here.)", "house"],
  ["die", "Eltern", "noun", "the parents", "Die Eltern ist hier. (The parents is here.)", "family"],
  ["die", "E-mail", "noun", "the e-mail", "Die E-mail ist hier. (The e-mail is here.)", "other"],
  ["der", "Empfänger", "noun", "the recipient", "Der Empfänger ist hier. (The recipient is here.)", "other"],
  ["", "empfehlen", "verb", "recommend", "Ich möchte empfehlen. (I would like to recommend.)", "verb"],
  ["", "enden", "verb", "to end", "Ich möchte enden. (I would like to end.)", "verb"],
  ["das", "Ende", "noun", "the end", "Das Ende ist hier. (The end is here.)", "other"],
  ["", "entschuldigen", "verb", "apologize", "Ich möchte entschuldigen. (I would like to apologize.)", "verb"],
  ["die", "Entschuldigung", "noun", "the apology", "Die Entschuldigung ist hier. (The apology is here.)", "other"],
  ["", "er", "other", "he", "Er wohnt in Berlin. (He lives in Berlin.)", "other"],
  ["das", "Ergebnis", "noun", "the result", "Das Ergebnis ist hier. (The result is here.)", "other"],
  ["", "erklären", "verb", "to explain", "Ich möchte erklären. (I would like to explain.)", "verb"],
  ["", "erlauben", "verb", "to allow", "Ich möchte erlauben. (I would like to allow.)", "verb"],
  ["der", "Erwachsene", "noun", "the adult", "Der Erwachsene ist hier. (The adult is here.)", "people"],
  ["", "erzählen", "verb", "tell", "Ich möchte erzählen. (I would like to tell.)", "verb"],
  ["", "es", "other", "it", "Es regnet heute. (It is raining today.)", "other"],
  ["", "essen", "verb", "to eat", "Ich möchte essen. (I would like to eat.)", "verb"],
  ["das", "Essen", "noun", "the food", "Das Essen ist hier. (The food is here.)", "food"],
  ["", "euer", "other", "your", "Das ist euer Auto. (That is your (pl.) car.)", "other"],
  ["", "fahren", "verb", "drive / ride", "Ich möchte fahren. (I would like to drive / ride.)", "verb"],
  ["der", "Fahrer", "noun", "the driver", "Der Fahrer ist hier. (The driver is here.)", "other"],
  ["die", "Fahrkarte", "noun", "the ticket", "Die Fahrkarte ist hier. (The ticket is here.)", "transport"],
  ["das", "Fahrrad", "noun", "the bicycle", "Das Fahrrad ist hier. (The bicycle is here.)", "transport"],
  ["", "falsch", "adjective", "wrong", "Das ist sehr falsch. (That is very wrong.)", "adjective"],
  ["die", "Familie", "noun", "the family", "Die Familie ist hier. (The family is here.)", "family"],
  ["der", "Familienname", "noun", "the surname", "Der Familienname ist hier. (The surname is here.)", "family"],
  ["der", "Familienstand", "noun", "the marital status", "Der Familienstand ist hier. (The marital status is here.)", "family"],
  ["die", "Farbe", "noun", "the color", "Die Farbe ist hier. (The color is here.)", "other"],
  ["das", "Fax", "noun", "the fax", "Das Fax ist hier. (The fax is here.)", "other"],
  ["", "Feier", "other", "celebration", "'Feier' bedeutet 'celebration'. ('Feier' means 'celebration'.)", "other"],
  ["", "feiern", "verb", "to celebrate", "Ich möchte feiern. (I would like to celebrate.)", "verb"],
  ["", "fehlen", "verb", "missing", "Ich möchte fehlen. (I would like to missing.)", "verb"],
  ["der", "Fehler", "noun", "the mistake", "Der Fehler ist hier. (The mistake is here.)", "other"],
  ["", "fernsehen", "verb", "to watch TV", "Ich möchte fernsehen. (I would like to watch TV.)", "verb"],
  ["", "fertig", "adjective", "finished", "Das ist sehr fertig. (That is very finished.)", "adjective"],
  ["das", "Feuer", "noun", "the fire", "Das Feuer ist hier. (The fire is here.)", "other"],
  ["das", "Fieber", "noun", "the fever", "Das Fieber ist hier. (The fever is here.)", "other"],
  ["der", "Film", "noun", "the film", "Der Film ist hier. (The film is here.)", "other"],
  ["", "finden", "verb", "find", "Ich möchte finden. (I would like to find.)", "verb"],
  ["die", "Firma", "noun", "the company", "Die Firma ist hier. (The company is here.)", "other"],
  ["der", "Fisch", "noun", "the fish", "Der Fisch ist hier. (The fish is here.)", "food"],
  ["die", "Flasche", "noun", "the bottle", "Die Flasche ist hier. (The bottle is here.)", "other"],
  ["das", "Fleisch", "noun", "the meat", "Das Fleisch ist hier. (The meat is here.)", "food"],
  ["", "fliegen", "verb", "to fly", "Ich möchte fliegen. (I would like to fly.)", "verb"],
  ["", "abfliegen", "verb", "depart", "Ich möchte abfliegen. (I would like to depart.)", "verb"],
  ["der", "Abflug", "noun", "the departure", "Der Abflug ist hier. (The departure is here.)", "transport"],
  ["der", "Flughafen", "noun", "the airport", "Der Flughafen ist hier. (The airport is here.)", "transport"],
  ["das", "Flugzeug", "noun", "the plane", "Das Flugzeug ist hier. (The plane is here.)", "transport"],
  ["das", "Formular", "noun", "the form", "Das Formular ist hier. (The form is here.)", "other"],
  ["das", "Foto", "noun", "the photo", "Das Foto ist hier. (The photo is here.)", "other"],
  ["", "fragen", "verb", "ask", "Ich möchte fragen. (I would like to ask.)", "verb"],
  ["die", "Frage", "noun", "question", "Die Frage ist hier. (Question is here.)", "other"],
  ["die", "Frau", "noun", "the woman", "Die Frau ist hier. (The woman is here.)", "people"],
  ["", "fremd", "adjective", "foreign", "Das ist sehr fremd. (That is very foreign.)", "adjective"],
  ["", "frei", "adjective", "free", "Das ist sehr frei. (That is very free.)", "adjective"],
  ["die", "Freizeit", "noun", "the free time", "Die Freizeit ist hier. (The free time is here.)", "time"],
  ["", "freuen", "verb", "to be glad", "Ich freuen mich. (I be glad myself.)", "verb"],
  ["der", "Freund", "noun", "the friend", "Der Freund ist hier. (The friend is here.)", "people"],
  ["", "früher", "adverb", "earlier", "Er kommt früher. (He comes earlier.)", "adverb"],
  ["", "frühstucken", "verb", "breakfast", "Ich möchte frühstucken. (I would like to breakfast.)", "verb"],
  ["das", "Frühstück", "noun", "breakfast", "Das Frühstück ist hier. (Breakfast is here.)", "food"],
  ["die", "Führung", "noun", "the leadership", "Die Führung ist hier. (The leadership is here.)", "other"],
  ["", "für", "other", "for", "Das ist ein Geschenk für dich. (This is a gift for you.)", "other"],
  ["der", "Fuß", "noun", "the foot", "Der Fuß ist hier. (The foot is here.)", "body"],
  ["der", "Fußball", "noun", "the football", "Der Fußball ist hier. (The football is here.)", "other"],
  ["der", "Garten", "noun", "the garden", "Der Garten ist hier. (The garden is here.)", "house"],
  ["der", "Gast", "noun", "the guest", "Der Gast ist hier. (The guest is here.)", "other"],
  ["", "geben", "verb", "give", "Ich möchte geben. (I would like to give.)", "verb"],
  ["", "geboren", "verb", "born", "Ich möchte geboren. (I would like to born.)", "verb"],
  ["das", "Geburtsjahr", "noun", "the year of birth", "Das Geburtsjahr ist hier. (The year of birth is here.)", "calendar"],
  ["der", "Geburtsort", "noun", "the place of birth", "Der Geburtsort ist hier. (The place of birth is here.)", "other"],
  ["der", "Geburtstag", "noun", "the birthday", "Der Geburtstag ist hier. (The birthday is here.)", "calendar"],
  ["", "gefallen", "verb", "to like", "Ich möchte gefallen. (I would like to like.)", "verb"],
  ["", "gegen", "other", "against", "Er spielt gegen seinen Freund. (He plays against his friend.)", "other"],
  ["", "gehen", "verb", "go", "Ich gehe zur Schule. (I go to school.)", "verb"],
  ["", "gehören", "verb", "to belong", "Ich möchte gehören. (I would like to belong.)", "verb"],
  ["das", "Geld", "noun", "the money", "Das Geld ist hier. (The money is here.)", "other"],
  ["das", "Gemüse", "noun", "the vegetables", "Das Gemüse ist hier. (The vegetables is here.)", "food"],
  ["das", "Gepäck", "noun", "the luggage", "Das Gepäck ist hier. (The luggage is here.)", "other"],
  ["", "gerade", "adjective", "just", "Das ist sehr gerade. (That is very just.)", "adjective"],
  ["", "geradeaus", "adverb", "straight ahead", "Er kommt geradeaus. (He comes straight ahead.)", "adverb"],
  ["", "gern", "adverb", "like", "Er kommt gern. (He comes like.)", "adverb"],
  ["das", "Geschäft", "noun", "the business", "Das Geschäft ist hier. (The business is here.)", "other"],
  ["das", "Geschenk", "noun", "the gift", "Das Geschenk ist hier. (The gift is here.)", "other"],
  ["die", "Geschwister", "noun", "the siblings", "Die Geschwister ist hier. (The siblings is here.)", "family"],
  ["das", "Gespräch", "noun", "the conversation", "Das Gespräch ist hier. (The conversation is here.)", "other"],
  ["", "gestern", "other", "yesterday", "'gestern' bedeutet 'yesterday'. ('gestern' means 'yesterday'.)", "time"],
  ["", "gestorben", "verb", "died", "Ich möchte gestorben. (I would like to died.)", "verb"],
  ["das", "Getränk", "noun", "the drink", "Das Getränk ist hier. (The drink is here.)", "other"],
  ["das", "Gewicht", "noun", "the weight", "Das Gewicht ist hier. (The weight is here.)", "other"],
  ["", "gewinnen", "verb", "win", "Ich möchte gewinnen. (I would like to win.)", "verb"],
  ["das", "Glas", "noun", "the glass", "Das Glas ist hier. (The glass is here.)", "other"],
  ["", "glauben", "verb", "to believe", "Ich möchte glauben. (I would like to believe.)", "verb"],
  ["", "gleich", "adjective", "right away", "Das ist sehr gleich. (That is very right away.)", "adjective"],
  ["das", "Gleis", "noun", "the track", "Das Gleis ist hier. (The track is here.)", "other"],
  ["das", "Glück", "noun", "the luck", "Das Glück ist hier. (The luck is here.)", "other"],
  ["", "glücklich", "adjective", "happy", "Das ist sehr glücklich. (That is very happy.)", "adjective"],
  ["der", "Glückwunsch", "noun", "the congratulations", "Der Glückwunsch ist hier. (The congratulations is here.)", "other"],
  ["", "Grad °C", "other", "degree°C", "'Grad °C' bedeutet 'degree°C'. ('Grad °C' means 'degree°C'.)", "other"],
  ["", "gratulieren", "verb", "congratulate", "Ich möchte gratulieren. (I would like to congratulate.)", "verb"],
  ["", "grillen", "verb", "to grill", "Ich möchte grillen. (I would like to grill.)", "verb"],
  ["", "groß", "adjective", "big", "Das ist sehr groß. (That is very big.)", "adjective"],
  ["die", "Größe", "noun", "the size", "Die Größe ist hier. (The size is here.)", "other"],
  ["die", "Großeltern", "noun", "the grandparents", "Die Großeltern ist hier. (The grandparents is here.)", "family"],
  ["die", "Großmutter", "noun", "the grandmother", "Die Großmutter ist hier. (The grandmother is here.)", "family"],
  ["der", "Großvater", "noun", "the grandfather", "Der Großvater ist hier. (The grandfather is here.)", "family"],
  ["die", "Gruppe", "noun", "the group", "Die Gruppe ist hier. (The group is here.)", "other"],
  ["der", "Gruß", "noun", "the greeting", "Der Gruß ist hier. (The greeting is here.)", "other"],
  ["", "gültig", "adjective", "valid", "Das ist sehr gültig. (That is very valid.)", "adjective"],
  ["", "günstig", "adjective", "cheap", "Das ist sehr günstig. (That is very cheap.)", "adjective"],
  ["", "gut", "adjective", "good", "Das ist sehr gut. (That is very good.)", "adjective"],
  ["das", "Haar", "noun", "the hair", "Das Haar ist hier. (The hair is here.)", "body"],
  ["", "haben", "verb", "to have", "Ich habe ein Auto. (I have a car.)", "verb"],
  ["das", "Hähnchen", "noun", "the chicken", "Das Hähnchen ist hier. (The chicken is here.)", "food"],
  ["die", "Halbpension", "noun", "the half board", "Die Halbpension ist hier. (The half board is here.)", "other"],
  ["die", "Halle", "noun", "the hall", "Die Halle ist hier. (The hall is here.)", "other"],
  ["", "hallo", "other", "hello", "'hallo' bedeutet 'hello'. ('hallo' means 'hello'.)", "other"],
  ["", "halten", "verb", "hold", "Ich möchte halten. (I would like to hold.)", "verb"],
  ["die", "Haltestelle", "noun", "the bus stop", "Die Haltestelle ist hier. (The bus stop is here.)", "other"],
  ["die", "Hand", "noun", "the hand", "Die Hand ist hier. (The hand is here.)", "body"],
  ["das", "Handy", "noun", "the cell phone", "Das Handy ist hier. (The cell phone is here.)", "electronics"],
  ["das", "Haus", "noun", "the house", "Das Haus ist hier. (The house is here.)", "house"],
  ["die", "Hausaufgabe", "noun", "the homework", "Die Hausaufgabe ist hier. (The homework is here.)", "house"],
  ["die", "Hausfrau", "noun", "the housewife", "Die Hausfrau ist hier. (The housewife is here.)", "professions"],
  ["der", "Hausmann", "noun", "the househusband", "Der Hausmann ist hier. (The househusband is here.)", "professions"],
  ["die", "Heimat", "noun", "native / home country", "Die Heimat ist hier. (Native / home country is here.)", "other"],
  ["", "heiraten", "verb", "marry", "Ich möchte heiraten. (I would like to marry.)", "verb"],
  ["", "heißen", "verb", "to be called", "Ich möchte heißen. (I would like to be called.)", "verb"],
  ["", "helfen", "verb", "help", "Ich möchte helfen. (I would like to help.)", "verb"],
  ["", "hell", "adjective", "light", "Das ist sehr hell. (That is very light.)", "adjective"],
  ["der", "Herd", "noun", "the stove", "Der Herd ist hier. (The stove is here.)", "house"],
  ["der", "Herr", "noun", "mister", "Der Herr ist hier. (Mister is here.)", "people"],
  ["", "herzlich", "adverb", "warmly", "Er kommt herzlich. (He comes warmly.)", "adverb"],
  ["", "heute", "adverb", "today", "Er kommt heute. (He comes today.)", "adverb"],
  ["", "hier", "adverb", "here", "Er kommt hier. (He comes here.)", "adverb"],
  ["die", "Hilfe", "noun", "the help", "Die Hilfe ist hier. (The help is here.)", "other"],
  ["", "hinten", "adverb", "back", "Er kommt hinten. (He comes back.)", "adverb"],
  ["das", "Hobby", "noun", "the hobby", "Das Hobby ist hier. (The hobby is here.)", "other"],
  ["", "hoch", "other", "up", "'hoch' bedeutet 'up'. ('hoch' means 'up'.)", "other"],
  ["die", "Hochzeit", "noun", "the wedding", "Die Hochzeit ist hier. (The wedding is here.)", "time"],
  ["", "holen", "verb", "get", "Ich möchte holen. (I would like to get.)", "verb"],
  ["", "hören", "verb", "hear", "Ich möchte hören. (I would like to hear.)", "verb"],
  ["das", "Hotel", "noun", "the hotel", "Das Hotel ist hier. (The hotel is here.)", "places"],
  ["der", "Hund", "noun", "the dog", "Der Hund ist hier. (The dog is here.)", "other"],
  ["der", "Hunger", "noun", "hunger", "Der Hunger ist hier. (Hunger is here.)", "food"],
  ["", "ich", "other", "I", "Ich lerne Deutsch. (I learn German.)", "other"],
  ["", "ihr/ihm/ihn", "other", "her/him/him", "'ihr/ihm/ihn' bedeutet 'her/him/him'. ('ihr/ihm/ihn' means 'her/him/him'.)", "other"],
  ["", "immer", "adverb", "always", "Er kommt immer. (He comes always.)", "adverb"],
  ["", "in", "other", "in", "Ich wohne in Jaunpur. (I live in Jaunpur.)", "other"],
  ["die", "Information", "noun", "the information", "Die Information ist hier. (The information is here.)", "other"],
  ["", "international", "adjective", "international", "Das ist sehr international. (That is very international.)", "adjective"],
  ["das", "Internet", "noun", "the internet", "Das Internet ist hier. (The internet is here.)", "electronics"],
  ["", "ja", "other", "yes", "Ja, das ist richtig. (Yes, that is correct.)", "other"],
  ["die", "Jacke", "noun", "the jacket", "Die Jacke ist hier. (The jacket is here.)", "clothing"],
  ["", "jed", "other", "every", "'jed' bedeutet 'every'. ('jed' means 'every'.)", "other"],
  ["", "jetzt", "adverb", "now", "Er kommt jetzt. (He comes now.)", "adverb"],
  ["der", "Job", "noun", "the job", "Der Job ist hier. (The job is here.)", "professions"],
  ["der", "Jugendliche", "noun", "the teenager", "Der Jugendliche ist hier. (The teenager is here.)", "people"],
  ["", "jung", "adjective", "young", "Das ist sehr jung. (That is very young.)", "adjective"],
  ["der", "Junge", "noun", "the boy", "Der Junge ist hier. (The boy is here.)", "people"],
  ["der", "kaffee", "noun", "the coffee", "Der kaffee ist hier. (The coffee is here.)", "food"],
  ["", "kaputt", "adjective", "broken", "Das ist sehr kaputt. (That is very broken.)", "adjective"],
  ["die", "Karte", "noun", "the card", "Die Karte ist hier. (The card is here.)", "other"],
  ["die", "Kartoffel", "noun", "the potato", "Die Kartoffel ist hier. (The potato is here.)", "food"],
  ["die", "Kasse", "noun", "the cash register", "Die Kasse ist hier. (The cash register is here.)", "other"],
  ["", "kaufen", "verb", "buy", "Ich möchte kaufen. (I would like to buy.)", "verb"],
  ["", "kein", "other", "no", "'kein' bedeutet 'no'. ('kein' means 'no'.)", "other"],
  ["", "kennen", "verb", "to know", "Ich möchte kennen. (I would like to know.)", "verb"],
  ["", "kennenlernen", "verb", "to get to know", "Ich möchte kennenlernen. (I would like to get know.)", "verb"],
  ["das", "Kind", "noun", "the child", "Das Kind ist hier. (The child is here.)", "people"],
  ["der", "kindergarten", "noun", "the kindergarten", "Der kindergarten ist hier. (The kindergarten is here.)", "places"],
  ["das", "Kino", "noun", "the cinema", "Das Kino ist hier. (The cinema is here.)", "places"],
  ["der", "Kiosk", "noun", "small shop", "Der Kiosk ist hier. (Small shop is here.)", "places"],
  ["", "klar", "adjective", "sure", "Das ist sehr klar. (That is very sure.)", "adjective"],
  ["die", "Klasse", "noun", "the class", "Die Klasse ist hier. (The class is here.)", "other"],
  ["die", "Kleidung", "noun", "the clothes", "Die Kleidung ist hier. (The clothes is here.)", "clothing"],
  ["", "klein", "adjective", "small", "Das ist sehr klein. (That is very small.)", "adjective"],
  ["", "kochen", "verb", "cook", "Ich möchte kochen. (I would like to cook.)", "verb"],
  ["der", "Koffer", "noun", "the suitcase", "Der Koffer ist hier. (The suitcase is here.)", "other"],
  ["der", "Kollege", "noun", "the colleague", "Der Kollege ist hier. (The colleague is here.)", "professions"],
  ["", "kommen", "verb", "come", "Er kommt aus Indien. (He comes from India.)", "verb"],
  ["", "können", "verb", "can", "Ich kann gut kochen. (I can cook well.)", "verb"],
  ["das", "Konto", "noun", "the account", "Das Konto ist hier. (The account is here.)", "other"],
  ["der", "Kopf", "noun", "the head", "Der Kopf ist hier. (The head is here.)", "body"],
  ["", "kosten", "verb", "to cost", "Ich möchte kosten. (I would like to cost.)", "verb"],
  ["", "kriegen", "verb", "get", "Ich möchte kriegen. (I would like to get.)", "verb"],
  ["die", "Küche", "noun", "the kitchen", "Die Küche ist hier. (The kitchen is here.)", "house"],
  ["der", "Kuchen", "noun", "the cake", "Der Kuchen ist hier. (The cake is here.)", "food"],
  ["der", "Kugelschreiber", "noun", "the ballpoint pen", "Der Kugelschreiber ist hier. (The ballpoint pen is here.)", "other"],
  ["der", "Kühlschrank", "noun", "the fridge", "Der Kühlschrank ist hier. (The fridge is here.)", "house"],
  ["", "kulturell", "adjective", "cultural", "Das ist sehr kulturell. (That is very cultural.)", "adjective"],
  ["", "kümmern", "verb", "to take care of", "Ich kümmern mich. (I take care of myself.)", "verb"],
  ["der", "Kunde", "noun", "the customer", "Der Kunde ist hier. (The customer is here.)", "professions"],
  ["der", "Kurs", "noun", "the course", "Der Kurs ist hier. (The course is here.)", "other"],
  ["", "kurz", "adjective", "briefly", "Das ist sehr kurz. (That is very briefly.)", "adjective"],
  ["", "lachen", "verb", "laugh", "Ich möchte lachen. (I would like to laugh.)", "verb"],
  ["der", "Laden", "noun", "the shop", "Der Laden ist hier. (The shop is here.)", "other"],
  ["das", "Land", "noun", "the country", "Das Land ist hier. (The country is here.)", "other"],
  ["", "lang", "adjective", "long", "Das ist sehr lang. (That is very long.)", "adjective"],
  ["", "lange", "other", "length", "'lange' bedeutet 'length'. ('lange' means 'length'.)", "other"],
  ["", "langsam", "adjective", "slowly", "Das ist sehr langsam. (That is very slowly.)", "adjective"],
  ["", "laufen", "verb", "walk", "Ich möchte laufen. (I would like to walk.)", "verb"],
  ["", "laut", "adjective", "loudly", "Das ist sehr laut. (That is very loudly.)", "adjective"],
  ["", "leben", "verb", "live", "Ich möchte leben. (I would like to live.)", "verb"],
  ["das", "Leben", "noun", "life", "Das Leben ist hier. (Life is here.)", "other"],
  ["die", "Lebensmittel", "noun", "food / groceries", "Die Lebensmittel ist hier. (Food / groceries is here.)", "food"],
  ["", "ledig", "adjective", "single", "Das ist sehr ledig. (That is very single.)", "adjective"],
  ["", "legen", "verb", "to lay", "Ich möchte legen. (I would like to lay.)", "verb"],
  ["der", "Lehrer", "noun", "the teacher", "Der Lehrer ist hier. (The teacher is here.)", "professions"],
  ["", "leicht", "adjective", "easy", "Das ist sehr leicht. (That is very easy.)", "adjective"],
  ["", "leider", "adverb", "unfortunately", "Er kommt leider. (He comes unfortunately.)", "adverb"],
  ["", "leise", "adjective", "quietly", "Das ist sehr leise. (That is very quietly.)", "adjective"],
  ["", "lernen", "verb", "learn", "Ich möchte lernen. (I would like to learn.)", "verb"],
  ["", "lesen", "verb", "read", "Ich möchte lesen. (I would like to read.)", "verb"],
  ["", "letzt", "adjective", "last", "Das ist sehr letzt. (That is very last.)", "adjective"],
  ["die", "Leute", "noun", "the people", "Die Leute ist hier. (The people is here.)", "other"],
  ["das", "Licht", "noun", "the light", "Das Licht ist hier. (The light is here.)", "other"],
  ["", "lieb", "adjective", "dear", "Das ist sehr lieb. (That is very dear.)", "adjective"],
  ["", "lieben", "verb", "love", "Ich möchte lieben. (I would like to love.)", "verb"],
  ["", "lieber", "adjective", "dear", "Das ist sehr lieber. (That is very dear.)", "adjective"],
  ["", "Lieblings", "other", "favorite", "'Lieblings' bedeutet 'favorite'. ('Lieblings' means 'favorite'.)", "other"],
  ["das", "Lied", "noun", "the song", "Das Lied ist hier. (The song is here.)", "other"],
  ["", "liegen", "verb", "to lay", "Ich möchte liegen. (I would like to lay.)", "verb"],
  ["", "links", "adverb", "left", "Er kommt links. (He comes left.)", "adverb"],
  ["der", "Lkw", "noun", "the truck", "Der Lkw ist hier. (The truck is here.)", "transport"],
  ["das", "Lokal", "noun", "the Pub", "Das Lokal ist hier. (The Pub is here.)", "places"],
  ["die", "Lösung", "noun", "the solution", "Die Lösung ist hier. (The solution is here.)", "other"],
  ["", "lustig", "adjective", "funny", "Das ist sehr lustig. (That is very funny.)", "adjective"],
  ["", "machen", "verb", "to make", "Ich mache meine Hausaufgaben. (I do my homework.)", "verb"],
  ["das", "Mädchen", "noun", "the girl", "Das Mädchen ist hier. (The girl is here.)", "people"],
  ["", "man", "other", "man", "Man lernt jeden Tag etwas Neues. (One learns something new every day.)", "other"],
  ["der", "Mann", "noun", "the man", "Der Mann ist hier. (The man is here.)", "people"],
  ["", "männlich", "adjective", "masculine", "Das ist sehr männlich. (That is very masculine.)", "adjective"],
  ["die", "Maschine", "noun", "the machine", "Die Maschine ist hier. (The machine is here.)", "other"],
  ["das", "Meer", "noun", "the sea", "Das Meer ist hier. (The sea is here.)", "other"],
  ["", "mehr", "adverb", "more", "Er kommt mehr. (He comes more.)", "adverb"],
  ["", "mein", "other", "my", "Das ist mein Buch. (That is my book.)", "other"],
  ["", "meist", "adjective", "mostly", "Das ist sehr meist. (That is very mostly.)", "adjective"],
  ["der", "Mensch", "noun", "the person", "Der Mensch ist hier. (The person is here.)", "people"],
  ["", "mieten", "verb", "to rent", "Ich möchte mieten. (I would like to rent.)", "verb"],
  ["die", "Miete", "noun", "the rent", "Die Miete ist hier. (The rent is here.)", "other"],
  ["die", "Milch", "noun", "the milk", "Die Milch ist hier. (The milk is here.)", "food"],
  ["", "mit", "other", "with", "Ich fahre mit dem Bus. (I go by bus.)", "other"],
  ["", "mitbringen", "verb", "to bring along", "Ich möchte mitbringen. (I would like to bring along.)", "verb"],
  ["", "mitkommen", "verb", "to come along", "Ich möchte mitkommen. (I would like to come along.)", "verb"],
  ["", "mitmachen", "verb", "to join in", "Ich möchte mitmachen. (I would like to join in.)", "verb"],
  ["", "mitnehmen", "verb", "take along", "Ich möchte mitnehmen. (I would like to take along.)", "verb"],
  ["die", "Mitte", "noun", "the middle", "Die Mitte ist hier. (The middle is here.)", "other"],
  ["die", "Möbel", "noun", "the furniture", "Die Möbel ist hier. (The furniture is here.)", "furniture"],
  ["", "möchten", "verb", "would like to", "Ich möchte einen Kaffee. (I would like a coffee.)", "verb"],
  ["", "mögen", "verb", "like", "Ich mag Schokolade. (I like chocolate.)", "verb"],
  ["", "möglich", "other", "possible", "'möglich' bedeutet 'possible'. ('möglich' means 'possible'.)", "other"],
  ["der", "Moment", "noun", "the moment", "Der Moment ist hier. (The moment is here.)", "time"],
  ["", "morgen", "adverb", "tomorrow/morning", "Er kommt morgen. (He comes tomorrow/morning.)", "adverb"],
  ["", "müde", "adjective", "tired", "Das ist sehr müde. (That is very tired.)", "adjective"],
  ["der", "Mund", "noun", "the mouth", "Der Mund ist hier. (The mouth is here.)", "body"],
  ["", "müssen", "verb", "must", "Ich muss jetzt gehen. (I must go now.)", "verb"],
  ["die", "Mutter", "noun", "the mother", "Die Mutter ist hier. (The mother is here.)", "family"],
  ["", "nach", "other", "after", "Ich fahre nach Berlin. (I travel to Berlin.)", "other"],
  ["", "nächst", "adverb", "next", "Er kommt nächst. (He comes next.)", "adverb"],
  ["der", "Name", "noun", "the name", "Der Name ist hier. (The name is here.)", "other"],
  ["", "nehmen", "verb", "take", "Ich möchte nehmen. (I would like to take.)", "verb"],
  ["", "nein", "other", "no", "Nein, das stimmt nicht. (No, that is not right.)", "other"],
  ["", "neu", "adjective", "new", "Das ist sehr neu. (That is very new.)", "adjective"],
  ["", "nicht", "adjective", "not", "Das ist sehr nicht. (That is very not.)", "adjective"],
  ["", "nichts", "other", "nothing", "'nichts' bedeutet 'nothing'. ('nichts' means 'nothing'.)", "other"],
  ["", "nie", "other", "never", "'nie' bedeutet 'never'. ('nie' means 'never'.)", "time"],
  ["", "noch", "adverb", "still", "Er kommt noch. (He comes still.)", "adverb"],
  ["", "normal", "adjective", "normal", "Das ist sehr normal. (That is very normal.)", "adjective"],
  ["die", "Nummer", "noun", "the number", "Die Nummer ist hier. (The number is here.)", "other"],
  ["", "nur", "adverb", "only", "Er kommt nur. (He comes only.)", "adverb"],
  ["", "oben", "adverb", "up", "Er kommt oben. (He comes up.)", "adverb"],
  ["das", "Obst", "noun", "the fruit", "Das Obst ist hier. (The fruit is here.)", "food"],
  ["", "oder", "other", "or", "Möchtest du Tee oder Kaffee? (Would you like tea or coffee?)", "other"],
  ["", "öffnen", "verb", "to open", "Ich möchte öffnen. (I would like to open.)", "verb"],
  ["", "geöffnet", "adjective", "open", "Das ist sehr geöffnet. (That is very open.)", "adjective"],
  ["", "oft", "adverb", "often", "Er kommt oft. (He comes often.)", "adverb"],
  ["", "ohne", "other", "without", "Ich trinke Kaffee ohne Zucker. (I drink coffee without sugar.)", "other"],
  ["das", "öl", "noun", "the oil", "Das öl ist hier. (The oil is here.)", "other"],
  ["die", "Oma", "noun", "the grandma", "Die Oma ist hier. (The grandma is here.)", "family"],
  ["der", "Opa", "noun", "the grandpa", "Der Opa ist hier. (The grandpa is here.)", "family"],
  ["die", "Ordnung", "noun", "the order", "Die Ordnung ist hier. (The order is here.)", "other"],
  ["der", "Ort", "noun", "the place", "Der Ort ist hier. (The place is here.)", "other"],
  ["das", "Papier", "noun", "the paper", "Das Papier ist hier. (The paper is here.)", "other"],
  ["die", "Papiere", "noun", "the papers", "Die Papiere ist hier. (The papers is here.)", "other"],
  ["der", "Partner", "noun", "the partner", "Der Partner ist hier. (The partner is here.)", "family"],
  ["die", "Partnerin", "noun", "the partner", "Die Partnerin ist hier. (The partner is here.)", "family"],
  ["die", "Party", "noun", "the party", "Die Party ist hier. (The party is here.)", "other"],
  ["der", "Pass", "noun", "the passport", "Der Pass ist hier. (The passport is here.)", "other"],
  ["die", "Pause", "noun", "the break", "Die Pause ist hier. (The break is here.)", "other"],
  ["der", "Plan", "noun", "the plan", "Der Plan ist hier. (The plan is here.)", "other"],
  ["der", "Platz", "noun", "the place", "Der Platz ist hier. (The place is here.)", "places"],
  ["die", "Polizei", "noun", "the police", "Die Polizei ist hier. (The police is here.)", "other"],
  ["die", "Pommes frites", "noun", "the French fries", "Die Pommes frites ist hier. (The French fries is here.)", "food"],
  ["die", "Post", "noun", "the post office", "Die Post ist hier. (The post office is here.)", "places"],
  ["die", "Postleitzahl", "noun", "the pin code", "Die Postleitzahl ist hier. (The pin code is here.)", "places"],
  ["das", "Praktikum", "noun", "the internship", "Das Praktikum ist hier. (The internship is here.)", "other"],
  ["die", "Praxis", "noun", "the practice", "Die Praxis ist hier. (The practice is here.)", "other"],
  ["der", "Preis", "noun", "the price", "Der Preis ist hier. (The price is here.)", "other"],
  ["das", "Problem", "noun", "the problem", "Das Problem ist hier. (The problem is here.)", "other"],
  ["der", "Prospekt", "noun", "the brochure", "Der Prospekt ist hier. (The brochure is here.)", "other"],
  ["die", "Prüfung", "noun", "the exam", "Die Prüfung ist hier. (The exam is here.)", "other"],
  ["", "pünktlich", "adjective", "punctual", "Das ist sehr pünktlich. (That is very punctual.)", "adjective"],
  ["", "Rad fahren", "verb", "to cycle", "Ich möchte Rad fahren. (I would like to cycle.)", "verb"],
  ["", "rauchen", "verb", "to smoke", "Ich möchte rauchen. (I would like to smoke.)", "verb"],
  ["der", "Raum", "noun", "the room", "Der Raum ist hier. (The room is here.)", "other"],
  ["die", "Rechnung", "noun", "the bill", "Die Rechnung ist hier. (The bill is here.)", "other"],
  ["", "rechts", "adverb", "right", "Er kommt rechts. (He comes right.)", "adverb"],
  ["", "regnen", "verb", "to rain", "Ich möchte regnen. (I would like to rain.)", "verb"],
  ["der", "Regen", "noun", "the rain", "Der Regen ist hier. (The rain is here.)", "other"],
  ["der", "Reis", "noun", "the rice", "Der Reis ist hier. (The rice is here.)", "other"],
  ["", "reisen", "verb", "to travel", "Ich möchte reisen. (I would like to travel.)", "verb"],
  ["die", "Reise", "noun", "the trip", "Die Reise ist hier. (The trip is here.)", "other"],
  ["das", "Reisebüro", "noun", "the travel agency", "Das Reisebüro ist hier. (The travel agency is here.)", "other"],
  ["der", "Reiseführer", "noun", "the travel guide", "Der Reiseführer ist hier. (The travel guide is here.)", "other"],
  ["", "reparieren", "verb", "to repair", "Ich möchte reparieren. (I would like to repair.)", "verb"],
  ["die", "Reparatur", "noun", "the repairing", "Die Reparatur ist hier. (The repairing is here.)", "other"],
  ["das", "Restaurant", "noun", "the restaurant", "Das Restaurant ist hier. (The restaurant is here.)", "places"],
  ["die", "Rezeption", "noun", "the reception", "Die Rezeption ist hier. (The reception is here.)", "other"],
  ["", "richtig", "adjective", "right", "Das ist sehr richtig. (That is very right.)", "adjective"],
  ["", "riechen", "verb", "to smell", "Ich möchte riechen. (I would like to smell.)", "verb"],
  ["", "ruhig", "adjective", "quiet", "Das ist sehr ruhig. (That is very quiet.)", "adjective"],
  ["der", "Saft", "noun", "the juice", "Der Saft ist hier. (The juice is here.)", "food"],
  ["", "sagen", "verb", "say", "Ich möchte sagen. (I would like to say.)", "verb"],
  ["der", "Salat", "noun", "the salad", "Der Salat ist hier. (The salad is here.)", "food"],
  ["das", "Salz", "noun", "the salt", "Das Salz ist hier. (The salt is here.)", "food"],
  ["", "Satz", "other", "sentence", "'Satz' bedeutet 'sentence'. ('Satz' means 'sentence'.)", "other"],
  ["die", "S-Bahn", "noun", "the S-Bahn", "Die S-Bahn ist hier. (The S-Bahn is here.)", "transport"],
  ["der", "Schalter", "noun", "switch / counter", "Der Schalter ist hier. (Switch / counter is here.)", "other"],
  ["", "scheinen", "verb", "to shine", "Ich möchte scheinen. (I would like to shine.)", "verb"],
  ["", "schicken", "verb", "to send", "Ich möchte schicken. (I would like to send.)", "verb"],
  ["das", "Schild", "noun", "the sign", "Das Schild ist hier. (The sign is here.)", "other"],
  ["der", "Schinken", "noun", "the ham", "Der Schinken ist hier. (The ham is here.)", "food"],
  ["", "schlafen", "verb", "to sleep", "Ich möchte schlafen. (I would like to sleep.)", "verb"],
  ["", "schlecht", "adjective", "bad", "Das ist sehr schlecht. (That is very bad.)", "adjective"],
  ["", "schließen", "verb", "to close", "Ich möchte schließen. (I would like to close.)", "verb"],
  ["", "geschlossen", "adjective", "closed", "Das ist sehr geschlossen. (That is very closed.)", "adjective"],
  ["der", "Schluss", "noun", "the conclusion", "Der Schluss ist hier. (The conclusion is here.)", "other"],
  ["der", "Schlüssel", "noun", "the key", "Der Schlüssel ist hier. (The key is here.)", "other"],
  ["", "schmecken", "verb", "to taste", "Ich möchte schmecken. (I would like to taste.)", "verb"],
  ["", "schnell", "adjective", "quickly", "Das ist sehr schnell. (That is very quickly.)", "adjective"],
  ["", "schon", "adverb", "already", "Er kommt schon. (He comes already.)", "adverb"],
  ["", "schön", "adjective", "beautiful", "Das ist sehr schön. (That is very beautiful.)", "adjective"],
  ["der", "Schrank", "noun", "the cupboard", "Der Schrank ist hier. (The cupboard is here.)", "house"],
  ["", "schreiben", "verb", "write", "Ich möchte schreiben. (I would like to write.)", "verb"],
  ["der", "Schuh", "noun", "the shoe", "Der Schuh ist hier. (The shoe is here.)", "clothing"],
  ["die", "Schule", "noun", "the school", "Die Schule ist hier. (The school is here.)", "places"],
  ["der", "Schuler", "noun", "the student", "Der Schuler ist hier. (The student is here.)", "professions"],
  ["", "schwer", "adjective", "heavy", "Das ist sehr schwer. (That is very heavy.)", "adjective"],
  ["die", "Schwester", "noun", "the sister", "Die Schwester ist hier. (The sister is here.)", "family"],
  ["", "schwimmen", "verb", "swim", "Ich möchte schwimmen. (I would like to swim.)", "verb"],
  ["das", "Schwimmbad", "noun", "the swimming pool", "Das Schwimmbad ist hier. (The swimming pool is here.)", "other"],
  ["der", "See", "noun", "the lake", "Der See ist hier. (The lake is here.)", "places"],
  ["", "sehen", "verb", "see / look", "Ich sehe einen Film. (I see a movie.)", "verb"],
  ["die", "Sehenswürdigkeit", "noun", "tourist sight", "Die Sehenswürdigkeit ist hier. (Tourist sight is here.)", "other"],
  ["", "sehr", "adverb", "very", "Er kommt sehr. (He comes very.)", "adverb"],
  ["", "sein", "verb", "to be / his", "Er ist mein Freund. (He is my friend.)", "verb"],
  ["", "an Sein", "verb", "to be on", "Das Licht ist an. (The light is on.)", "verb"],
  ["", "auf Sein", "verb", "to be open", "Die Tür ist auf. (The door is open.)", "verb"],
  ["", "weg Sein", "verb", "to be away", "Mein Handy ist weg. (My phone is gone.)", "verb"],
  ["", "zu Sein", "verb", "to be closed", "Das Geschäft ist zu. (The shop is closed.)", "verb"],
  ["", "seit", "other", "since", "Ich lerne seit einem Jahr Deutsch. (I have been learning German for a year.)", "other"],
  ["", "selbststandig", "adjective", "independent", "Das ist sehr selbststandig. (That is very independent.)", "adjective"],
  ["", "sich", "other", "themselves", "Er freut sich. (He is glad.)", "other"],
  ["", "sie", "other", "she/they", "Sie kommt aus Indien. (She comes from India / They come from India.)", "other"],
  ["", "Sie", "other", "you Formal", "Sie kommt aus Indien. (She comes from India / They come from India.)", "other"],
  ["", "sitzen", "verb", "sit", "Ich möchte sitzen. (I would like to sit.)", "verb"],
  ["", "so", "other", "so", "'so' bedeutet 'so'. ('so' means 'so'.)", "other"],
  ["das", "Sofa", "noun", "the sofa", "Das Sofa ist hier. (The sofa is here.)", "furniture"],
  ["", "sofort", "adjective", "immediately", "Das ist sehr sofort. (That is very immediately.)", "adjective"],
  ["der", "Sohn", "noun", "the son", "Der Sohn ist hier. (The son is here.)", "family"],
  ["", "sollen", "verb", "should", "Ich soll früh aufstehen. (I am supposed to get up early.)", "verb"],
  ["die", "Sonne", "noun", "the sun", "Die Sonne ist hier. (The sun is here.)", "other"],
  ["", "spät", "adjective", "late", "Das ist sehr spät. (That is very late.)", "adjective"],
  ["", "später", "adverb", "later", "Er kommt später. (He comes later.)", "adverb"],
  ["die", "Speisekarte", "noun", "the menu", "Die Speisekarte ist hier. (The menu is here.)", "other"],
  ["", "spielen", "verb", "play", "Ich möchte spielen. (I would like to play.)", "verb"],
  ["der", "Sport", "noun", "the sport", "Der Sport ist hier. (The sport is here.)", "other"],
  ["die", "Sprache", "noun", "the language", "Die Sprache ist hier. (The language is here.)", "other"],
  ["", "spechen", "verb", "speak", "Ich möchte spechen. (I would like to speak.)", "verb"],
  ["die", "Stadt", "noun", "the city", "Die Stadt ist hier. (The city is here.)", "places"],
  ["", "stehen", "verb", "to stand", "Ich möchte stehen. (I would like to stand.)", "verb"],
  ["die", "Stelle", "noun", "the place", "Die Stelle ist hier. (The place is here.)", "other"],
  ["", "stellen", "verb", "to put", "Ich möchte stellen. (I would like to put.)", "verb"],
  ["der", "Stock", "noun", "the floor", "Der Stock ist hier. (The floor is here.)", "other"],
  ["die", "Straße", "noun", "the street", "Die Straße ist hier. (The street is here.)", "other"],
  ["die", "Straßenbahn", "noun", "the tram", "Die Straßenbahn ist hier. (The tram is here.)", "transport"],
  ["", "studieren", "verb", "study", "Ich möchte studieren. (I would like to study.)", "verb"],
  ["das", "Studium", "noun", "the studies", "Das Studium ist hier. (The studies is here.)", "other"],
  ["der", "Student", "noun", "the student", "Der Student ist hier. (The student is here.)", "professions"],
  ["die", "Stunde", "noun", "the hour", "Die Stunde ist hier. (The hour is here.)", "time"],
  ["", "suchen", "verb", "to search", "Ich möchte suchen. (I would like to search.)", "verb"],
  ["", "tanzen", "verb", "dance", "Ich möchte tanzen. (I would like to dance.)", "verb"],
  ["die", "Tasche", "noun", "the bag", "Die Tasche ist hier. (The bag is here.)", "other"],
  ["das", "Taxi", "noun", "the taxi", "Das Taxi ist hier. (The taxi is here.)", "transport"],
  ["der", "Tee", "noun", "the tea", "Der Tee ist hier. (The tea is here.)", "food"],
  ["der", "Teil", "noun", "the part", "Der Teil ist hier. (The part is here.)", "other"],
  ["", "telefonieren", "verb", "to telephone", "Ich möchte telefonieren. (I would like to telephone.)", "verb"],
  ["das", "Telefon", "noun", "the telephone", "Das Telefon ist hier. (The telephone is here.)", "electronics"],
  ["das", "Termin", "noun", "the appointment", "Das Termin ist hier. (The appointment is here.)", "calendar"],
  ["der", "Test", "noun", "the test", "Der Test ist hier. (The test is here.)", "other"],
  ["", "teuer", "adjective", "expensive", "Das ist sehr teuer. (That is very expensive.)", "adjective"],
  ["der", "Text", "noun", "the text", "Der Text ist hier. (The text is here.)", "other"],
  ["das", "Thema", "noun", "the topic", "Das Thema ist hier. (The topic is here.)", "other"],
  ["das", "Ticket", "noun", "the ticket", "Das Ticket ist hier. (The ticket is here.)", "other"],
  ["der", "Tisch", "noun", "the table", "Der Tisch ist hier. (The table is here.)", "furniture"],
  ["der", "Tochter", "noun", "the daughter", "Der Tochter ist hier. (The daughter is here.)", "family"],
  ["die", "Toilette", "noun", "the toilet", "Die Toilette ist hier. (The toilet is here.)", "other"],
  ["die", "Tomate", "noun", "the tomato", "Die Tomate ist hier. (The tomato is here.)", "food"],
  ["", "tot", "adjective", "dead", "Das ist sehr tot. (That is very dead.)", "adjective"],
  ["", "treffen", "verb", "meet", "Ich möchte treffen. (I would like to meet.)", "verb"],
  ["die", "Treppe", "noun", "the stairs", "Die Treppe ist hier. (The stairs is here.)", "other"],
  ["", "trinken", "verb", "to drink", "Ich möchte trinken. (I would like to drink.)", "verb"],
  ["", "tschüss", "other", "bye", "'tschüss' bedeutet 'bye'. ('tschüss' means 'bye'.)", "other"],
  ["", "tun", "verb", "do", "Was kann ich für dich tun? (What can I do for you?)", "verb"],
  ["", "über", "other", "above /over /on", "Der Vogel fliegt über das Haus. (The bird flies over the house.)", "other"],
  ["", "übernachten", "verb", "stay overnight", "Ich möchte übernachten. (I would like to stay overnight.)", "verb"],
  ["", "überweisen", "verb", "transfer", "Ich möchte überweisen. (I would like to transfer.)", "verb"],
  ["die", "Uhr", "noun", "the clock", "Die Uhr ist hier. (The clock is here.)", "other"],
  ["", "um", "other", "about", "Wir treffen uns um acht Uhr. (We meet at eight o'clock.)", "other"],
  ["", "umziehen", "verb", "to change", "Ich möchte umziehen. (I would like to change.)", "verb"],
  ["", "und", "other", "and", "Ich esse Brot und Käse. (I eat bread and cheese.)", "other"],
  ["", "unser", "other", "our", "Das ist unser Haus. (That is our house.)", "other"],
  ["", "unten", "adverb", "below", "Er kommt unten. (He comes below.)", "adverb"],
  ["", "unter", "other", "under /below", "Die Katze schläft unter dem Tisch. (The cat sleeps under the table.)", "other"],
  ["der", "Unterricht", "noun", "lesson /class", "Der Unterricht ist hier. (Lesson /class is here.)", "other"],
  ["", "unterschreiben", "verb", "to sign", "Ich möchte unterschreiben. (I would like to sign.)", "verb"],
  ["die", "Unterschrift", "noun", "signature", "Die Unterschrift ist hier. (Signature is here.)", "other"],
  ["der", "Urlaub", "noun", "the holiday", "Der Urlaub ist hier. (The holiday is here.)", "other"],
  ["der", "Vater", "noun", "the father", "Der Vater ist hier. (The father is here.)", "family"],
  ["", "verboten", "adjective", "forbidden", "Das ist sehr verboten. (That is very forbidden.)", "adjective"],
  ["", "verdienen", "verb", "earn", "Ich möchte verdienen. (I would like to earn.)", "verb"],
  ["der", "Verein", "noun", "the club", "Der Verein ist hier. (The club is here.)", "other"],
  ["", "verheiratet", "adjective", "married", "Das ist sehr verheiratet. (That is very married.)", "adjective"],
  ["", "verkaufen", "verb", "sell", "Ich möchte verkaufen. (I would like to sell.)", "verb"],
  ["der", "Verkäufer", "noun", "the seller", "Der Verkäufer ist hier. (The seller is here.)", "professions"],
  ["", "vermieten", "verb", "rent out", "Ich möchte vermieten. (I would like to rent out.)", "verb"],
  ["der", "Vermieter", "noun", "the landlord", "Der Vermieter ist hier. (The landlord is here.)", "professions"],
  ["", "verstehen", "verb", "understand", "Ich möchte verstehen. (I would like to understand.)", "verb"],
  ["die", "Verwandte", "noun", "the relative", "Die Verwandte ist hier. (The relative is here.)", "family"],
  ["", "viel", "adjective", "much", "Das ist sehr viel. (That is very much.)", "adjective"],
  ["", "vielleicht", "adjective", "maybe", "Das ist sehr vielleicht. (That is very maybe.)", "adjective"],
  ["", "von", "other", "from", "Das ist ein Geschenk von meiner Mutter. (That is a gift from my mother.)", "other"],
  ["", "vor", "other", "before", "Das Auto steht vor dem Haus. (The car is in front of the house.)", "other"],
  ["der", "Vorname", "noun", "the first name", "Der Vorname ist hier. (The first name is here.)", "other"],
  ["die", "Vorsicht", "noun", "the caution", "Die Vorsicht ist hier. (The caution is here.)", "other"],
  ["", "vorstellen", "verb", "introduce", "Ich vorstellen mich. (I introduce myself.)", "verb"],
  ["die", "Vorwahl", "noun", "the area code", "Die Vorwahl ist hier. (The area code is here.)", "other"],
  ["", "wandern", "verb", "to hike", "Ich möchte wandern. (I would like to hike.)", "verb"],
  ["", "wann", "other", "when", "Wann kommst du? (When are you coming?)", "other"],
  ["", "warten", "verb", "wait", "Ich möchte warten. (I would like to wait.)", "verb"],
  ["", "warum", "other", "why", "Warum lernst du Deutsch? (Why do you learn German?)", "other"],
  ["", "was", "other", "what", "Was machst du? (What are you doing?)", "other"],
  ["", "was für ein", "other", "what kind of", "'was für ein' bedeutet 'what kind of'. ('was für ein' means 'what kind of'.)", "other"],
  ["", "waschen", "verb", "wash", "Ich möchte waschen. (I would like to wash.)", "verb"],
  ["das", "Wasser", "noun", "the water", "Das Wasser ist hier. (The water is here.)", "food"],
  ["", "weh tun", "verb", "hurt", "Ich möchte weh tun. (I would like to hurt.)", "verb"],
  ["", "weiblich", "adjective", "female", "Das ist sehr weiblich. (That is very female.)", "adjective"],
  ["der", "Wein", "noun", "the wine", "Der Wein ist hier. (The wine is here.)", "food"],
  ["", "weit", "other", "far", "'weit' bedeutet 'far'. ('weit' means 'far'.)", "other"],
  ["", "weiter", "adverb", "further", "Er kommt weiter. (He comes further.)", "adverb"],
  ["", "welch", "other", "which", "Welches Buch möchtest du? (Which book would you like?)", "other"],
  ["die", "Welt", "noun", "the world", "Die Welt ist hier. (The world is here.)", "other"],
  ["", "wenig", "other", "little", "'wenig' bedeutet 'little'. ('wenig' means 'little'.)", "other"],
  ["", "wer", "other", "who", "Wer ist das? (Who is that?)", "other"],
  ["", "werden", "verb", "become/will", "Ich werde Lehrer. (I will become a teacher.)", "verb"],
  ["das", "Wetter", "noun", "the weather", "Das Wetter ist hier. (The weather is here.)", "other"],
  ["", "wichtig", "adjective", "important", "Das ist sehr wichtig. (That is very important.)", "adjective"],
  ["", "wie", "other", "how", "Wie geht es dir? (How are you?)", "other"],
  ["", "wiederholen", "verb", "to repeat", "Ich möchte wiederholen. (I would like to repeat.)", "verb"],
  ["das", "Wiederhören", "noun", "hear again", "Das Wiederhören ist hier. (Hear again is here.)", "other"],
  ["das", "Wiedersehen", "noun", "see again", "Das Wiedersehen ist hier. (See again is here.)", "other"],
  ["", "wie viel", "other", "how much", "'wie viel' bedeutet 'how much'. ('wie viel' means 'how much'.)", "other"],
  ["", "willkommen", "verb", "welcome", "Ich möchte willkommen. (I would like to welcome.)", "verb"],
  ["der", "Wind", "noun", "the wind", "Der Wind ist hier. (The wind is here.)", "other"],
  ["", "wir", "other", "we", "Wir lernen zusammen. (We learn together.)", "other"],
  ["", "wissen", "verb", "to know", "Ich weiß die Antwort. (I know the answer.)", "verb"],
  ["", "wo", "other", "where", "Wo wohnst du? (Where do you live?)", "other"],
  ["", "woher", "other", "where from", "Woher kommst du? (Where are you from?)", "other"],
  ["", "wohin", "other", "where to", "Wohin gehst du? (Where are you going?)", "other"],
  ["", "wohnen", "verb", "live", "Ich möchte wohnen. (I would like to live.)", "verb"],
  ["die", "Wohnung", "noun", "the apartment", "Die Wohnung ist hier. (The apartment is here.)", "house"],
  ["", "wollen", "verb", "to want", "Ich will Deutsch lernen. (I want to learn German.)", "verb"],
  ["das", "Wort", "noun", "the word", "Das Wort ist hier. (The word is here.)", "other"],
  ["", "wunderbar", "adjective", "wonderful", "Das ist sehr wunderbar. (That is very wonderful.)", "adjective"],
  ["", "zahlen", "verb", "pay", "Ich möchte zahlen. (I would like to pay.)", "verb"],
  ["die", "Zeit", "noun", "the time", "Die Zeit ist hier. (The time is here.)", "time"],
  ["", "zurzeit", "adverb", "at the moment", "Er kommt zurzeit. (He comes at the moment.)", "adverb"],
  ["die", "Zeitung", "noun", "the newspaper", "Die Zeitung ist hier. (The newspaper is here.)", "time"],
  ["die", "Zigarette", "noun", "the cigarette", "Die Zigarette ist hier. (The cigarette is here.)", "other"],
  ["das", "Zimmer", "noun", "the room", "Das Zimmer ist hier. (The room is here.)", "house"],
  ["der", "Zoll", "noun", "the custom office", "Der Zoll ist hier. (The custom office is here.)", "other"],
  ["", "zu", "other", "to", "Ich gehe zu meinem Freund. (I go to my friend.)", "other"],
  ["", "zufrieden", "adjective", "satisfied", "Das ist sehr zufrieden. (That is very satisfied.)", "adjective"],
  ["der", "Zug", "noun", "the train", "Der Zug ist hier. (The train is here.)", "transport"],
  ["", "zurück", "adverb", "back", "Er kommt zurück. (He comes back.)", "adverb"],
  ["", "zusammen", "adverb", "together", "Er kommt zusammen. (He comes together.)", "adverb"],
  ["", "zwischen", "other", "between", "Der Stuhl steht zwischen dem Tisch und dem Bett. (The chair stands between the table and the bed.)", "other"],
];

// Leitner-box review gaps (ms). Box 0 = due again same session, box 5 = mastered (~monthly review).
const BOX_INTERVALS = [0, 24 * 3600 * 1000, 3 * 24 * 3600 * 1000, 7 * 24 * 3600 * 1000, 14 * 24 * 3600 * 1000, 30 * 24 * 3600 * 1000];
const MASTERY_STREAK = 3; // consecutive correct answers needed to clear "problem" status
const VOCAB_DATA_VERSION = "2026-08-a1-easy-v2";

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}
function daysBetween(a, b) {
  const [ay, am, ad] = a.split("-").map(Number);
  const [by, bm, bd] = b.split("-").map(Number);
  const da = new Date(ay, am - 1, ad).getTime();
  const db = new Date(by, bm - 1, bd).getTime();
  return Math.round((db - da) / 86400000);
}
function normalize(s) {
  return (s || "").trim().toLowerCase().replace(/[.!?,;:]+$/g, "");
}
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function emptyWordStat() {
  return { seen: 0, correct: 0, wrong: 0, streak: 0, lastResult: null, learnedAt: null, box: 0, dueAt: 0 };
}
function isProblem(stat) {
  return !!stat && stat.wrong > 0 && !stat.learnedAt;
}
function speak(text) {
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "de-DE";
    u.rate = 0.88;
    window.speechSynthesis.speak(u);
  } catch (e) {}
}

const DEFAULT_STATS = () => ({
  date: todayStr(),
  todayAttempts: 0,
  todayCorrect: 0,
  totalAttempts: 0,
  totalCorrect: 0,
  dailyLimit: 100,
  attemptsRemaining: 100,
  newWordCap: 15,
  newWordsToday: 0,
  streak: 0,
  lastPracticeDate: null,
  audioAutoplay: false,
  wordStats: {},
});

// ---------- Lo-fi study music: fully synthesized, no external files/CORS needed ----------
function useLofiMusic() {
  const ctxRef = useRef(null);
  const masterGainRef = useRef(null);
  const timersRef = useRef([]);
  const sourcesRef = useRef([]);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.42);

  const stop = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    sourcesRef.current.forEach((s) => {
      try { s.stop(); } catch (e) {}
    });
    sourcesRef.current = [];
    setPlaying(false);
  }, []);

  const start = useCallback(() => {
    try {
      if (!ctxRef.current) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        ctxRef.current = new Ctx();
        masterGainRef.current = ctxRef.current.createGain();
        masterGainRef.current.gain.value = volume;
        masterGainRef.current.connect(ctxRef.current.destination);
      }

      const ctx = ctxRef.current;
      if (ctx.state === "suspended") ctx.resume();
      const master = masterGainRef.current;

      // Warm, slow chord loop: Cmaj7 -> Am7 -> Fmaj7 -> G6.
      const chords = [
        [261.63, 329.63, 392.0, 493.88],
        [220.0, 261.63, 329.63, 392.0],
        [174.61, 220.0, 261.63, 329.63],
        [196.0, 246.94, 293.66, 392.0],
      ];
      const bass = [130.81, 110.0, 87.31, 98.0];
      const melody = [659.25, 587.33, 523.25, 493.88, 523.25, 587.33, 659.25, 783.99];
      const chordDuration = 4.8;
      const beatDuration = 0.6;
      let chordIndex = 0;
      let beat = 0;

      function connectWithTone(osc, gainValue, startTime, duration, filterFreq = 1200) {
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = filterFreq;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, gainValue), startTime + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
        osc.connect(filter).connect(gain).connect(master);
        osc.start(startTime);
        osc.stop(startTime + duration + 0.02);
        sourcesRef.current.push(osc);
      }

      function playChord(startTime) {
        const freqs = chords[chordIndex % chords.length];
        const bassFreq = bass[chordIndex % bass.length];
        chordIndex++;

        freqs.forEach((f, i) => {
          const osc = ctx.createOscillator();
          osc.type = i === 0 ? "sine" : "triangle";
          osc.frequency.value = f;
          connectWithTone(osc, 0.035, startTime, chordDuration - 0.15, 900);
        });

        const bassOsc = ctx.createOscillator();
        bassOsc.type = "sine";
        bassOsc.frequency.value = bassFreq;
        connectWithTone(bassOsc, 0.055, startTime, chordDuration - 0.25, 500);
      }

      function scheduleChords() {
        playChord(ctx.currentTime + 0.08);
        const id = setTimeout(scheduleChords, chordDuration * 1000);
        timersRef.current.push(id);
      }

      function playMelodyNote(startTime, freq) {
        const osc = ctx.createOscillator();
        osc.type = "triangle";
        osc.frequency.value = freq;
        connectWithTone(osc, 0.012, startTime, 0.42, 1800);
      }

      function scheduleMelody() {
        const startTime = ctx.currentTime + 0.04;
        playMelodyNote(startTime, melody[beat % melody.length]);
        beat++;
        const id = setTimeout(scheduleMelody, beatDuration * 1000);
        timersRef.current.push(id);
      }

      function scheduleDrums() {
        const now = ctx.currentTime;
        // Soft kick.
        const kick = ctx.createOscillator();
        kick.type = "sine";
        kick.frequency.setValueAtTime(105, now);
        kick.frequency.exponentialRampToValueAtTime(52, now + 0.18);
        const kickGain = ctx.createGain();
        kickGain.gain.setValueAtTime(0.0001, now);
        kickGain.gain.exponentialRampToValueAtTime(0.045, now + 0.01);
        kickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
        kick.connect(kickGain).connect(master);
        kick.start(now);
        kick.stop(now + 0.24);
        sourcesRef.current.push(kick);

        // Tiny vinyl-style hat.
        const buf = ctx.createBuffer(1, Math.floor(0.025 * ctx.sampleRate), ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
        const hat = ctx.createBufferSource();
        hat.buffer = buf;
        const hp = ctx.createBiquadFilter();
        hp.type = "highpass";
        hp.frequency.value = 4200;
        const hg = ctx.createGain();
        hg.gain.value = beat % 2 === 0 ? 0.009 : 0.005;
        hat.connect(hp).connect(hg).connect(master);
        hat.start(now);
        hat.stop(now + 0.03);
        sourcesRef.current.push(hat);

        const id = setTimeout(scheduleDrums, 1200);
        timersRef.current.push(id);
      }

      // Soft filtered noise bed.
      const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const noiseData = noiseBuffer.getChannelData(0);
      for (let i = 0; i < noiseData.length; i++) noiseData[i] = (Math.random() * 2 - 1) * 0.22;
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "lowpass";
      noiseFilter.frequency.value = 1800;
      const noiseGain = ctx.createGain();
      noiseGain.gain.value = 0.008;
      noise.connect(noiseFilter).connect(noiseGain).connect(master);
      noise.start();
      sourcesRef.current.push(noise);

      scheduleChords();
      scheduleMelody();
      scheduleDrums();
      setPlaying(true);
    } catch (e) {
      // Web Audio unavailable: leave the music toggle harmless.
    }
  }, [volume]);

  const setVolume = useCallback((v) => {
    setVolumeState(v);
    if (masterGainRef.current) masterGainRef.current.gain.value = v;
  }, []);

  const toggle = () => (playing ? stop() : start());

  useEffect(() => () => stop(), [stop]);

  return { playing, toggle, volume, setVolume };
}

// Picks the next word for the smart "all words" mix: problem/overdue words first,
// new words trickled in one-by-one in list order (like working through the PDF),
// and occasional early review thrown in for reinforcement. Avoids repeating the
// same word twice in a row when other options exist.
function pickNextNewWord(source, stats, excludeId) {
  if (source.length === 0) return null;
  const brandNew = source.filter((w) => {
    const st = stats.wordStats[w.id];
    return !st || st.seen === 0;
  });
  if (brandNew.length === 0) return null;
  const first = brandNew[0];
  if (first.id !== excludeId || brandNew.length === 1) return first;
  return brandNew[1];
}

function pickSmartWord(source, stats, excludeId, ignoreNewWordCap) {
  if (source.length === 0) return null;
  const now = Date.now();
  const dueNow = [];
  const brandNew = [];
  const notYetDue = [];
  source.forEach((w) => {
    const s = stats.wordStats[w.id];
    if (!s || s.seen === 0) brandNew.push(w);
    else if ((s.dueAt || 0) <= now) dueNow.push(w);
    else notYetDue.push(w);
  });
  dueNow.sort((a, b) => {
    const sa = stats.wordStats[a.id];
    const sb = stats.wordStats[b.id];
    const pa = isProblem(sa) ? 0 : 1;
    const pb = isProblem(sb) ? 0 : 1;
    if (pa !== pb) return pa - pb;
    return (sa.dueAt || 0) - (sb.dueAt || 0) || (sa.box || 0) - (sb.box || 0);
  });
  brandNew.sort((a, b) => source.indexOf(a) - source.indexOf(b));

  const pickFrom = (arr) => {
    if (arr.length === 0) return null;
    const filtered = arr.length > 1 ? arr.filter((w) => w.id !== excludeId) : arr;
    const pool = filtered.length > 0 ? filtered : arr;
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const canIntroduceNew = brandNew.length > 0 && (ignoreNewWordCap || stats.newWordsToday < stats.newWordCap);
  const r = Math.random();

  if (dueNow.length > 0 && (r < 0.6 || !canIntroduceNew)) {
    const sliceSize = Math.max(5, Math.ceil(dueNow.length * 0.3));
    return pickFrom(dueNow.slice(0, sliceSize));
  }
  if (canIntroduceNew && (r < 0.9 || dueNow.length === 0)) {
    return brandNew[0].id === excludeId && brandNew.length > 1 ? brandNew[1] : brandNew[0];
  }
  if (notYetDue.length > 0) return pickFrom(notYetDue);
  if (dueNow.length > 0) return pickFrom(dueNow);
  if (brandNew.length > 0) return brandNew[0];
  return pickFrom(source);
}

function englishKey(s) {
  return normalize(s)
    .replace(/^(the|a|an|to)\s+/i, "")
    .replace(/\s+/g, " ");
}

const GERMAN_SYNONYM_GROUPS = [
  ["Kuli", "Stift", "Kugelschreiber"],
  ["Arzt", "Doktor"],
  ["Großmutter", "Oma"],
  ["Großvater", "Opa"],
  ["Wohnung", "Apartment"],
  ["Geschäft", "Laden", "Shop"],
  ["Zug", "Bahn"],
  ["Fahrrad", "Rad"],
];

function synonymGroupFor(de) {
  const key = normalize(de);
  return GERMAN_SYNONYM_GROUPS.find((group) => group.some((x) => normalize(x) === key)) || null;
}

function acceptedGermanAnswers(word, vocab) {
  const answers = new Set([normalize(word.de), normalize(`${word.artikel || ""} ${word.de}`)]);
  const group = synonymGroupFor(word.de);
  if (group) {
    group.forEach((de) => answers.add(normalize(de)));
    vocab.forEach((w) => {
      if (group.some((de) => normalize(w.de) === normalize(de))) {
        answers.add(normalize(`${w.artikel || ""} ${w.de}`));
      }
    });
  }
  const key = englishKey(word.en);
  vocab.forEach((w) => {
    if (englishKey(w.en) === key) {
      answers.add(normalize(w.de));
      answers.add(normalize(`${w.artikel || ""} ${w.de}`));
    }
  });
  return answers;
}

function englishAnswerIsCorrect(given, word) {
  return normalize(given) !== "" && englishKey(given) === englishKey(word.en);
}

function germanAnswerIsCorrect(given, word, vocab) {
  const g = normalize(given);
  return g !== "" && acceptedGermanAnswers(word, vocab).has(g);
}
function displayGermanAnswers(word, vocab) {
  const answers = new Set([word.de]);
  const group = synonymGroupFor(word.de);
  if (group) group.forEach((de) => answers.add(de));
  const key = englishKey(word.en);
  vocab.forEach((w) => {
    if (englishKey(w.en) === key) answers.add(w.de);
  });
  return Array.from(answers).join(" / ");
}

function mergeWords(existing, packRows, refreshExamples = true) {
  const packMap = new Map(
    packRows.map(([artikel, de, pos, en, example, category]) => [
      `${de.trim().toLowerCase()}|${en.trim().toLowerCase()}`,
      { artikel, de, pos, en, example, category },
    ])
  );
  const keys = new Set(existing.map((w) => `${w.de.trim().toLowerCase()}|${w.en.trim().toLowerCase()}`));
  const updated = existing.map((w) => {
    const p = packMap.get(`${w.de.trim().toLowerCase()}|${w.en.trim().toLowerCase()}`);
    if (!p) return w;
    return {
      ...w,
      artikel: p.artikel,
      pos: p.pos,
      en: p.en,
      category: p.category,
      example: refreshExamples ? p.example : (w.example || p.example),
    };
  });
  const added = [];
  for (const [artikel, de, pos, en, example, category] of packRows) {
    const key = `${de.trim().toLowerCase()}|${en.trim().toLowerCase()}`;
    if (keys.has(key)) continue;
    keys.add(key);
    added.push({ id: uid(), de, artikel, pos, en, example, category });
  }
  return [...updated, ...added];
}

// Netlify Identity sets its nf_jwt/nf_refresh auth cookies with no expiry, so
// browsers drop them as session-only cookies once the browser fully closes —
// even though the login itself is still saved in localStorage. Re-writing the
// same cookies with a long max-age keeps the saved login recognized across
// browser restarts instead of forcing a fresh login every time.
function persistIdentityCookies() {
  if (typeof document === "undefined") return;
  const THIRTY_DAYS = 60 * 60 * 24 * 30;
  ["nf_jwt", "nf_refresh"].forEach((name) => {
    const match = new RegExp(`(?:^|; )${name}=([^;]*)`).exec(document.cookie);
    if (match) {
      document.cookie = `${name}=${match[1]}; path=/; secure; samesite=lax; max-age=${THIRTY_DAYS}`;
    }
  });
}

export default function GermanVocabTrainer() {
  const [ready, setReady] = useState(false);
  const [vocab, setVocab] = useState([]);
  const [stats, setStats] = useState(DEFAULT_STATS());
  const [tab, setTab] = useState("passive");
  const [pool, setPool] = useState("all");
  const [category, setCategory] = useState("all");
  const [saveError, setSaveError] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("login");
  const [syncState, setSyncState] = useState("idle");
  const [hasSyncedOnce, setHasSyncedOnce] = useState(false);
  const vocabRef = useRef(vocab);
  const statsRef = useRef(stats);
  const lofi = useLofiMusic();

  useEffect(() => {
    vocabRef.current = vocab;
  }, [vocab]);
  useEffect(() => {
    statsRef.current = stats;
  }, [stats]);

  useEffect(() => {
    let unsubscribe = () => {};
    (async () => {
      try {
        const result = await handleAuthCallback();
        if (result?.type === "recovery") {
          setAuthModalMode("reset");
          setAuthModalOpen(true);
        }
      } catch (e) {}
      setAuthUser(await getUser());
      persistIdentityCookies();
    })();
    unsubscribe = onAuthChange((_event, user) => {
      setAuthUser(user);
      persistIdentityCookies();
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!authUser || !ready) return;
    let cancelled = false;
    (async () => {
      setSyncState("syncing");
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) throw new Error("Failed to load profile");
        const profile = await res.json();
        if (cancelled) return;
        if (profile.vocabList && profile.vocabList.length > 0) {
          setVocab(mergeWords(profile.vocabList, ALL_VOCABULARY_PACK, false));
          setStats({ ...DEFAULT_STATS(), ...profile.stats, dailyLimit: 100 });
        } else {
          await fetch("/api/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ vocabList: vocabRef.current, stats: statsRef.current }),
          });
        }
        if (!cancelled) {
          setSyncState("synced");
          setHasSyncedOnce(true);
        }
      } catch (e) {
        if (!cancelled) setSyncState("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [authUser, ready]);

  useEffect(() => {
    if (!authUser) {
      setHasSyncedOnce(false);
      return;
    }
    if (!ready || !hasSyncedOnce) return;
    const timer = setTimeout(async () => {
      setSyncState("syncing");
      try {
        const res = await fetch("/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vocabList: vocab, stats }),
        });
        if (!res.ok) throw new Error("Failed to save profile");
        setSyncState("synced");
      } catch (e) {
        setSyncState("error");
      }
    }, 800);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vocab, stats, authUser, ready, hasSyncedOnce]);

  useEffect(() => {
    (async () => {
      let loadedVocab = null;
      let loadedStats = null;
      let vocabVersion = null;
      try {
        const v = await Promise.resolve({ value: localStorage.getItem("vocab-list") });
        if (v && v.value) loadedVocab = JSON.parse(v.value);
      } catch (e) {}
      try {
        const s = await Promise.resolve({ value: localStorage.getItem("vocab-stats") });
        if (s && s.value) loadedStats = JSON.parse(s.value);
      } catch (e) {}
      try {
        const version = await Promise.resolve({ value: localStorage.getItem("vh-vocab-version") });
        if (version && version.value) vocabVersion = version.value;
      } catch (e) {}

      const refreshExamples = vocabVersion !== VOCAB_DATA_VERSION;
      if (!loadedVocab || loadedVocab.length === 0) {
        loadedVocab = mergeWords([], ALL_VOCABULARY_PACK, true);
      } else {
        loadedVocab = mergeWords(loadedVocab, ALL_VOCABULARY_PACK, refreshExamples);
      }

      let nextStats = loadedStats ? { ...DEFAULT_STATS(), ...loadedStats } : DEFAULT_STATS();
      nextStats.dailyLimit = 100;
      nextStats.attemptsRemaining = Math.min(100, Math.max(0, Number(nextStats.attemptsRemaining ?? 100)));
      if (nextStats.date !== todayStr()) {
        const gap = nextStats.lastPracticeDate ? daysBetween(nextStats.lastPracticeDate, todayStr()) : null;
        nextStats = {
          ...nextStats,
          date: todayStr(),
          todayAttempts: 0,
          todayCorrect: 0,
          attemptsRemaining: 100,
          newWordsToday: 0,
          streak: gap !== null && gap > 1 ? 0 : nextStats.streak || 0,
        };
      }

      setVocab(loadedVocab);
      setStats(nextStats);
      setReady(true);

      try {
        localStorage.setItem("vh-vocab-version", VOCAB_DATA_VERSION);
      } catch (e) {}
    })();
  }, []);

  const persistVocab = useCallback(async (next) => {
    try {
      localStorage.setItem("vocab-list", JSON.stringify(next));
    } catch (e) {
      setSaveError(true);
    }
  }, []);
  const persistStats = useCallback(async (next) => {
    try {
      localStorage.setItem("vocab-stats", JSON.stringify(next));
    } catch (e) {
      setSaveError(true);
    }
  }, []);
  useEffect(() => {
    if (ready) persistVocab(vocab);
  }, [vocab, ready, persistVocab]);
  useEffect(() => {
    if (ready) persistStats(stats);
  }, [stats, ready, persistStats]);

  const wordStatsFor = (id) => stats.wordStats[id] || emptyWordStat();

  const categoryVocab = useMemo(() => (category === "all" ? vocab : vocab.filter((w) => w.category === category)), [vocab, category]);

  const problemWords = useMemo(() => categoryVocab.filter((w) => isProblem(wordStatsFor(w.id))), [categoryVocab, stats]);
  const learnedWords = useMemo(() => categoryVocab.filter((w) => wordStatsFor(w.id).learnedAt), [categoryVocab, stats]);
  const newWords = useMemo(() => categoryVocab.filter((w) => wordStatsFor(w.id).seen === 0), [categoryVocab, stats]);
  const trainedCount = useMemo(() => vocab.filter((w) => wordStatsFor(w.id).seen > 0).length, [vocab, stats]);
  const masteredCount = useMemo(() => vocab.filter((w) => wordStatsFor(w.id).learnedAt).length, [vocab, stats]);
  const problemCount = useMemo(() => vocab.filter((w) => isProblem(wordStatsFor(w.id))).length, [vocab, stats]);

  const filteredPoolWords = useMemo(() => {
    if (pool === "problem") return problemWords;
    if (pool === "new") return newWords;
    if (pool === "learned") return learnedWords;
    return categoryVocab;
  }, [pool, categoryVocab, problemWords, newWords, learnedWords]);

  const locked = stats.attemptsRemaining <= 0;

  const recordAttempt = (wordId, correct) => {
    setStats((prev) => {
      const ws = { ...prev.wordStats };
      const cur = ws[wordId] ? { ...ws[wordId] } : emptyWordStat();
      const wasNew = cur.seen === 0;
      const now = Date.now();
      cur.seen += 1;
      if (correct) {
        cur.correct += 1;
        cur.streak += 1;
        cur.lastResult = "correct";
        if (cur.streak >= MASTERY_STREAK && !cur.learnedAt) cur.learnedAt = now;
        cur.box = Math.min((cur.box || 0) + 1, 5);
        cur.dueAt = now + BOX_INTERVALS[cur.box];
      } else {
        cur.wrong += 1;
        cur.streak = 0;
        cur.lastResult = "wrong";
        cur.learnedAt = null;
        cur.box = 0;
        cur.dueAt = now;
      }
      ws[wordId] = cur;

      // Correct answers add one available attempt; incorrect answers spend one.
      // The daily pool starts at 100 and never exceeds 100.
      const attemptsRemaining = correct
        ? Math.min(100, prev.attemptsRemaining + 1)
        : Math.max(0, prev.attemptsRemaining - 1);

      let streak = prev.streak || 0;
      if (prev.lastPracticeDate !== todayStr()) {
        const gap = prev.lastPracticeDate ? daysBetween(prev.lastPracticeDate, todayStr()) : null;
        streak = gap === 1 ? streak + 1 : 1;
      }

      return {
        ...prev,
        todayAttempts: prev.todayAttempts + 1,
        todayCorrect: prev.todayCorrect + (correct ? 1 : 0),
        totalAttempts: prev.totalAttempts + 1,
        totalCorrect: prev.totalCorrect + (correct ? 1 : 0),
        newWordsToday: prev.newWordsToday + (wasNew ? 1 : 0),
        attemptsRemaining,
        streak,
        lastPracticeDate: todayStr(),
        wordStats: ws,
      };
    });
  };

  const updateSettings = (patch) => {
    setStats((prev) => {
      const next = { ...prev, ...patch, dailyLimit: 100 };
      next.attemptsRemaining = Math.min(100, Math.max(0, next.attemptsRemaining));
      return next;
    });
  };

  const overallPct = stats.totalAttempts ? Math.round((stats.totalCorrect / stats.totalAttempts) * 100) : 0;
  const achievements = useMemo(() => {
    let n = 0;
    [10, 25, 50, 100, 200].forEach((t) => masteredCount >= t && n++);
    [3, 7, 14, 30].forEach((t) => (stats.streak || 0) >= t && n++);
    return n;
  }, [masteredCount, stats.streak]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {}
    setAuthUser(null);
    setSyncState("idle");
  };

  if (!ready) {
    return (
      <div style={styles.loadingWrap}>
        <div style={styles.loadingCard}>Lade Vokabeln…</div>
      </div>
    );
  }

  return (
    <div className="vh-page" style={styles.page}>
      <style>{globalCss}</style>
      <div style={styles.container}>
        <Header
          vocabCount={vocab.length}
          overallPct={overallPct}
          streak={stats.streak}
          achievements={achievements}
          audioAutoplay={stats.audioAutoplay}
          onToggleAudioAutoplay={() => updateSettings({ audioAutoplay: !stats.audioAutoplay })}
          lofi={lofi}
          authUser={authUser}
          syncState={syncState}
          onOpenAuth={() => {
            setAuthModalMode("login");
            setAuthModalOpen(true);
          }}
          onLogout={handleLogout}
        />

        {authModalOpen && (
          <AuthModal
            initialMode={authModalMode}
            onClose={() => {
              setAuthModalOpen(false);
              setAuthModalMode("login");
            }}
            onAuthed={(user) => {
              setAuthUser(user);
              setAuthModalOpen(false);
              setAuthModalMode("login");
            }}
          />
        )}

        <div className="vh-tabs" style={styles.tabs}>
          <TabButton active={tab === "passive"} onClick={() => setTab("passive")} icon={<BookOpen size={15} />}>
            Passive
          </TabButton>
          <TabButton active={tab === "active"} onClick={() => setTab("active")} icon={<Pencil size={15} />}>
            Active
          </TabButton>
          <TabButton active={tab === "groups"} onClick={() => setTab("groups")} icon={<Layers size={15} />}>
            Group practice
          </TabButton>
          <TabButton active={tab === "manage"} onClick={() => setTab("manage")} icon={<Plus size={15} />}>
            My words
          </TabButton>
        </div>

        <div className="vh-grid" style={styles.grid}>
          <div style={styles.mainCol}>
            {locked && tab !== "manage" && tab !== "groups" && pool !== "new" && pool !== "learned" && <LockedCard stats={stats} />}
            {(pool === "new" || pool === "learned") && (tab === "passive" || tab === "active") ? (
              <VocabularyListPanel
                title={pool === "new" ? "New words" : "Learned words"}
                words={pool === "new" ? newWords : learnedWords}
              />
            ) : (
              <>
                {!locked && tab === "passive" && (
                  <PassiveQuiz pool={pool} category={category} filteredPoolWords={filteredPoolWords} allVocab={vocab} stats={stats} recordAttempt={recordAttempt} />
                )}
                {!locked && tab === "active" && (
                  <ActiveQuiz pool={pool} category={category} filteredPoolWords={filteredPoolWords} allVocab={vocab} stats={stats} recordAttempt={recordAttempt} />
                )}
              </>
            )}
            {tab === "groups" && <GroupPractice vocab={vocab} stats={stats} recordAttempt={recordAttempt} locked={locked} />}
            {tab === "manage" && <ManageVocab vocab={vocab} setVocab={setVocab} stats={stats} setStats={setStats} updateSettings={updateSettings} />}
          </div>

          <div style={styles.sideCol}>
            <StatsPanel stats={stats} trainedCount={trainedCount} totalWords={vocab.length} masteredCount={masteredCount} problemCount={problemCount} />
            <ListsPanel
              pool={pool}
              setPool={setPool}
              counts={{ all: categoryVocab.length, problem: problemWords.length, new: newWords.length, learned: learnedWords.length }}
            />
            <CategoryPanel category={category} setCategory={setCategory} />
            {saveError && <div style={styles.saveError}>Couldn't save just now — check your connection.</div>}
          </div>
        </div>

        <div className="vh-coffee-footer" style={styles.coffeeFooter}>
          <div style={styles.coffeeText}>
            <Coffee size={16} style={{ marginRight: 6, verticalAlign: "-3px" }} />
            Enjoying this? Support the trainer with a coffee.
          </div>
          <a
            href="https://buymeacoffee.com/manishgupta21"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.coffeeLink}
            className="vh-btn"
          >
            Buy me a coffee
          </a>
          <img src="/buy-me-a-coffee-qr.png" alt="Scan to buy me a coffee" style={styles.coffeeQr} />
        </div>
      </div>
    </div>
  );
}

function Header({ vocabCount, overallPct, streak, achievements, audioAutoplay, onToggleAudioAutoplay, lofi, authUser, syncState, onOpenAuth, onLogout }) {
  return (
    <div>
      <div className="vh-header-row" style={styles.headerRow}>
        <div className="vh-brand-row" style={styles.brandRow}>
          <img src="/icons/icon-512.png" alt="DeutschVocab logo" style={styles.logo} />
          <div>
            <h1 className="vh-title" style={styles.title}>DeutschVocab</h1>
            <p className="vh-subtitle" style={styles.subtitle}>{vocabCount}+ words · your own pace</p>
          </div>
        </div>
        <div className="vh-header-controls" style={styles.headerControls}>
          <button
            className="vh-btn"
            onClick={onToggleAudioAutoplay}
            style={{ ...styles.iconToggle, ...(audioAutoplay ? styles.iconToggleActive : {}) }}
            title={audioAutoplay ? "Auto-pronounce: on" : "Auto-pronounce: off"}
            type="button"
          >
            {audioAutoplay ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>
          <button
            className={`vh-btn ${lofi.playing ? "vh-lofi-pulse" : ""}`}
            onClick={lofi.toggle}
            style={{ ...styles.iconToggle, ...(lofi.playing ? styles.iconToggleActive : {}) }}
            title={lofi.playing ? "Pause lo-fi study music" : "Play lo-fi study music"}
            type="button"
          >
            <Music size={15} />
          </button>
          {lofi.playing && (
            <input
              className="vh-volume-slider"
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={lofi.volume}
              onChange={(e) => lofi.setVolume(parseFloat(e.target.value))}
              style={styles.volumeSlider}
              aria-label="Lo-fi music volume"
            />
          )}
          <AccountControl authUser={authUser} syncState={syncState} onOpenAuth={onOpenAuth} onLogout={onLogout} />
          <div className="vh-flag-dot" style={styles.flagDot} aria-hidden="true">
            <span style={{ background: "#1F2A44" }} />
            <span style={{ background: "#B5443B" }} />
            <span style={{ background: "#D4A94F" }} />
          </div>
        </div>
      </div>
      <div className="vh-chip-row" style={styles.chipRow}>
        <span className="vh-chip" style={styles.chip}>
          <BookOpen size={13} /> {vocabCount} words
        </span>
        <span className="vh-chip" style={styles.chip}>
          <Zap size={13} /> {overallPct}%
        </span>
        <span className="vh-chip" style={styles.chip}>
          <Flame size={13} color={streak > 0 ? "#D97B3C" : "#A39C88"} /> {streak} day streak
        </span>
        <span className="vh-chip" style={styles.chip}>
          <Award size={13} /> {achievements} achievements
        </span>
      </div>
    </div>
  );
}

const AVATAR_PALETTES = [
  ["#D4A94F", "#B5443B"],
  ["#3D5A8A", "#4F8A66"],
  ["#A13D5C", "#D97B3C"],
  ["#3F7859", "#28345A"],
  ["#7A5A2B", "#215339"],
  ["#1F2A44", "#D4A94F"],
];

function avatarPaletteFor(seed) {
  const s = seed || "?";
  let hash = 0;
  for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
  return AVATAR_PALETTES[hash % AVATAR_PALETTES.length];
}

function Avatar({ seed, label, size = 32 }) {
  const [c1, c2] = avatarPaletteFor(seed);
  const initial = (label || "?").trim().charAt(0).toUpperCase() || "?";
  return (
    <span
      className="vh-avatar"
      style={{
        width: size,
        height: size,
        minWidth: size,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${c1}, ${c2})`,
        color: "#FBF8F1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Fraunces', serif",
        fontWeight: 700,
        fontSize: Math.round(size * 0.42),
        boxShadow: "0 2px 6px rgba(31,42,68,0.25)",
      }}
    >
      {initial}
    </span>
  );
}

function AccountControl({ authUser, syncState, onOpenAuth, onLogout }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onOutside);
    document.addEventListener("touchstart", onOutside);
    return () => {
      document.removeEventListener("mousedown", onOutside);
      document.removeEventListener("touchstart", onOutside);
    };
  }, [open]);

  if (!authUser) {
    return (
      <button className="vh-btn" onClick={onOpenAuth} style={styles.accountBtn} type="button">
        <User size={14} /> Log in
      </button>
    );
  }

  const fullName = authUser.userMetadata?.full_name;
  const label = fullName || authUser.email;
  const seed = authUser.id || authUser.email || "user";
  const syncIcon =
    syncState === "syncing" ? (
      <Loader2 size={12} className="vh-spin" />
    ) : syncState === "error" ? (
      <CloudOff size={12} color="#B5443B" />
    ) : (
      <Cloud size={12} color="#4F8A66" />
    );
  const syncTitle = syncState === "syncing" ? "Syncing your profile…" : syncState === "error" ? "Couldn't sync — will retry" : "Profile synced";

  return (
    <div className="vh-account" style={styles.accountWrap} ref={wrapRef}>
      <button
        className="vh-btn"
        onClick={() => setOpen((o) => !o)}
        style={styles.avatarBtn}
        title={label}
        type="button"
      >
        <Avatar seed={seed} label={label} size={32} />
      </button>

      {open && (
        <div className="vh-account-popover" style={styles.accountPopover}>
          <Avatar seed={seed} label={label} size={56} />
          <div style={styles.accountPopoverName}>{fullName || "Your profile"}</div>
          <div style={styles.accountPopoverEmail}>{authUser.email}</div>
          <div style={{ ...styles.accountPopoverSync, color: syncState === "error" ? "#B5443B" : "#8A8474" }}>
            {syncIcon} {syncTitle}
          </div>
          <button
            className="vh-btn"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            style={styles.accountPopoverLogout}
            type="button"
          >
            <LogOut size={14} /> Log out
          </button>
        </div>
      )}
    </div>
  );
}

function AuthModal({ onClose, onAuthed, initialMode = "login" }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const friendlyError = (err) => {
    if (err instanceof AuthError) {
      if (err.status === 401) return "Invalid email or password.";
      if (err.status === 403) return "Signups are currently disabled for this site.";
      if (err.status === 422) return "Check your email and use a password with at least 6 characters.";
      if (err.status === 404) return "No account found with that email.";
      return err.message || "Something went wrong. Please try again.";
    }
    return "Something went wrong. Please try again.";
  };

  const switchMode = (next) => {
    setMode(next);
    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      if (mode === "login") {
        const user = await login(email, password);
        onAuthed(user);
      } else if (mode === "signup") {
        const user = await signup(email, password, { full_name: name });
        if (user.emailVerified) {
          onAuthed(user);
        } else {
          setMessage("Check your email to confirm your account, then log in.");
          switchMode("login");
        }
      } else if (mode === "forgot") {
        await requestPasswordRecovery(email);
        setMessage("If an account exists for that email, a reset link is on its way.");
      } else if (mode === "reset") {
        if (password.length < 6) {
          setError("Use a password with at least 6 characters.");
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setError("Passwords don't match.");
          setLoading(false);
          return;
        }
        const user = await updateUser({ password });
        onAuthed(user);
      }
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  const copy = {
    login: { icon: <User size={20} />, title: "Welcome back", subtitle: "Log in to sync your vocabulary and progress across every device." },
    signup: { icon: <Sparkles size={20} />, title: "Create your profile", subtitle: "Save your progress and pick up where you left off, anywhere." },
    forgot: { icon: <Mail size={20} />, title: "Reset your password", subtitle: "Enter your email and we'll send you a link to choose a new one." },
    reset: { icon: <Lock size={20} />, title: "Set a new password", subtitle: "Choose a new password to finish resetting your account." },
  }[mode];

  return (
    <div className="vh-modal-overlay" style={styles.modalOverlay} onClick={mode === "reset" ? undefined : onClose}>
      <div className="vh-card" style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {mode !== "reset" && (
          <button className="vh-btn" onClick={onClose} style={styles.modalClose} type="button" aria-label="Close">
            <X size={16} />
          </button>
        )}
        <div style={styles.modalIconBadge}>{copy.icon}</div>
        <h2 style={styles.modalTitle}>{copy.title}</h2>
        <p style={styles.modalSubtitle}>{copy.subtitle}</p>

        <form onSubmit={handleSubmit} style={styles.authForm}>
          {mode === "forgot" && (
            <button type="button" className="vh-btn" style={styles.backLink} onClick={() => switchMode("login")}>
              <ArrowLeft size={13} /> Back to log in
            </button>
          )}

          {mode === "signup" && (
            <div style={styles.inputGroup}>
              <User size={14} style={styles.inputIcon} />
              <input
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.inputWithIcon}
                autoComplete="name"
              />
            </div>
          )}

          {(mode === "login" || mode === "signup" || mode === "forgot") && (
            <div style={styles.inputGroup}>
              <Mail size={14} style={styles.inputIcon} />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.inputWithIcon}
                autoComplete="email"
                required
              />
            </div>
          )}

          {(mode === "login" || mode === "signup") && (
            <div style={styles.inputGroup}>
              <Lock size={14} style={styles.inputIcon} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...styles.inputWithIcon, paddingRight: 38 }}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                minLength={6}
                required
              />
              <button
                type="button"
                style={styles.passwordToggle}
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          )}

          {mode === "login" && (
            <button type="button" className="vh-btn" style={styles.forgotLink} onClick={() => switchMode("forgot")}>
              Forgot password?
            </button>
          )}

          {mode === "reset" && (
            <>
              <div style={styles.inputGroup}>
                <Lock size={14} style={styles.inputIcon} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ ...styles.inputWithIcon, paddingRight: 38 }}
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  style={styles.passwordToggle}
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <div style={styles.inputGroup}>
                <Lock size={14} style={styles.inputIcon} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={styles.inputWithIcon}
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
              </div>
            </>
          )}

          {error && <div style={styles.saveError}>{error}</div>}
          {message && <div style={styles.saveSuccess}>{message}</div>}

          <button className="vh-btn" type="submit" style={{ ...styles.addBtn, width: "100%", justifyContent: "center" }} disabled={loading}>
            {loading ? (
              <Loader2 size={15} className="vh-spin" />
            ) : mode === "login" ? (
              <User size={15} />
            ) : mode === "signup" ? (
              <Sparkles size={15} />
            ) : mode === "forgot" ? (
              <Mail size={15} />
            ) : (
              <Lock size={15} />
            )}
            {loading
              ? "Please wait…"
              : mode === "login"
              ? "Log in"
              : mode === "signup"
              ? "Sign up"
              : mode === "forgot"
              ? "Send reset link"
              : "Update password"}
          </button>
        </form>
        {(mode === "login" || mode === "signup") && (
          <button className="vh-btn" type="button" style={styles.modalToggle} onClick={() => switchMode(mode === "login" ? "signup" : "login")}>
            {mode === "login" ? "New here? Create a profile" : "Already have a profile? Log in"}
          </button>
        )}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, children, icon }) {
  return (
    <button onClick={onClick} className="vh-btn vh-tab-btn" style={{ ...styles.tabBtn, ...(active ? styles.tabBtnActive : {}) }}>
      {icon}
      {children}
    </button>
  );
}

function LockedCard({ stats }) {
  return (
    <div style={{ ...styles.card, textAlign: "center", padding: "44px 26px" }}>
      <Moon size={26} color="#A39C88" style={{ marginBottom: 10 }} />
      <h2 style={{ ...styles.sectionTitle, marginBottom: 6 }}>Daily attempts used</h2>
      <p style={{ color: "#8A8474", fontSize: 13.5, maxWidth: 360, margin: "0 auto" }}>
        You have no attempts remaining today. Your 100 daily attempts will reset tomorrow.
      </p>
    </div>
  );
}

function SpeakerBtn({ text, size = 15 }) {
  return (
    <button
      className="vh-btn vh-speaker"
      onClick={(e) => {
        e.stopPropagation();
        speak(text);
      }}
      aria-label={`Pronounce ${text}`}
      style={styles.speakerBtn}
      type="button"
    >
      <Volume2 size={size} />
    </button>
  );
}

function PassiveQuiz({ pool, category, filteredPoolWords, allVocab, stats, recordAttempt }) {
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const autoTimerRef = useRef(null);

  const buildQuestion = useCallback(
    (excludeId) => {
      const source = filteredPoolWords;
      const target = pool === "all" ? pickSmartWord(source, stats, excludeId, category !== "all") : pool === "new" ? pickNextNewWord(source, stats, excludeId) : source.length ? source[Math.floor(Math.random() * source.length)] : null;
      if (!target) return null;
      const targetKey = englishKey(target.en);
      const others = shuffle(
        allVocab.filter((w) => w.id !== target.id && englishKey(w.en) !== targetKey)
      ).slice(0, 5);
      return { target, options: shuffle([target, ...others]) };
    },
    [pool, category, filteredPoolWords, allVocab, stats]
  );
  const buildQuestionRef = useRef(buildQuestion);
  buildQuestionRef.current = buildQuestion;

  useEffect(() => {
    setQuestion(buildQuestionRef.current(null));
    setSelected(null);
    setShowHint(false);
    setRevealed(false);
    return () => clearTimeout(autoTimerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool, category]);

  const next = useCallback(() => {
    clearTimeout(autoTimerRef.current);
    setQuestion((q) => buildQuestionRef.current(q?.target?.id));
    setSelected(null);
    setShowHint(false);
    setRevealed(false);
  }, []);

  const choose = (opt) => {
    if (revealed || !question) return;
    const correct = opt.id === question.target.id;
    setSelected(opt.id);
    setRevealed(true);
    recordAttempt(question.target.id, correct);
    if (correct) autoTimerRef.current = setTimeout(() => next(), 1000);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (!question) return;
      if (revealed) {
        if (e.key === "Enter") next();
        return;
      }
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= question.options.length) choose(question.options[n - 1]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => () => clearTimeout(autoTimerRef.current), []);

  useEffect(() => {
    if (question && stats.audioAutoplay) {
      const w = question.target;
      speak(w.artikel ? `${w.artikel} ${w.de}` : w.de);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question]);

  if (!question) return <EmptyState pool={pool} />;

  const { target, options } = question;
  const artColor = ARTICLE_COLORS[target.artikel] || null;

  return (
    <div className="vh-card" style={styles.card}>
      {target.category && <span className="vh-category-tag" style={styles.categoryTag}>{CATEGORY_LABEL[target.category] || target.category}</span>}
      <div className="vh-qhead" style={styles.qHead}>
        {target.artikel && (
          <span className="vh-artikel-badge" style={{ ...styles.artikelBadge, color: artColor.text, background: artColor.bg, borderColor: artColor.border }}>
            {target.artikel}
          </span>
        )}
        <span className="vh-german-word" style={styles.germanWord}>{target.de}</span>
        <SpeakerBtn text={target.artikel ? `${target.artikel} ${target.de}` : target.de} />
      </div>
      <div className="vh-pos-label" style={styles.posLabel}>{target.pos}</div>

      {target.example && (
        <button className="vh-hint-box" style={styles.hintBox} onClick={() => setShowHint((s) => !s)}>
          <Lightbulb size={14} color="#B5443B" />
          <span>{showHint ? target.example : "Tap for an example sentence"}</span>
        </button>
      )}

      <div className="vh-options-grid" style={styles.optionsGrid}>
        {options.map((opt, i) => {
          const isCorrect = opt.id === target.id;
          const isChosen = selected === opt.id;
          let style = { ...styles.optionBtn };
          let animClass = "";
          if (revealed && isCorrect) {
            style = { ...style, ...styles.optionCorrect };
            animClass = " vh-option-correct";
          } else if (revealed && isChosen && !isCorrect) {
            style = { ...style, ...styles.optionWrong };
            animClass = " vh-option-wrong";
          }
          return (
            <button key={opt.id} onClick={() => choose(opt)} style={style} disabled={revealed} className={"vh-btn vh-option" + animClass}>
              <span style={styles.optionNum}>{i + 1}</span>
              {opt.en}
              {revealed && isCorrect && <Check size={16} style={{ marginLeft: "auto" }} />}
              {revealed && isChosen && !isCorrect && <X size={16} style={{ marginLeft: "auto" }} />}
            </button>
          );
        })}
      </div>

      <div className="vh-card-footer" style={styles.cardFooter}>
        <span className="vh-footer-hint" style={styles.footerHint}>Keys 1–{options.length} to answer{revealed ? " · Enter for next" : ""}</span>
        {revealed && (
          <button style={styles.nextBtn} className="vh-btn" onClick={next}>
            Next word →
          </button>
        )}
      </div>
    </div>
  );
}

const SPECIAL_CHARS = ["ä", "ö", "ü", "ß", "Ä", "Ö", "Ü"];

function ActiveQuiz({ pool, category, filteredPoolWords, allVocab, stats, recordAttempt }) {
  const [question, setQuestion] = useState(null);
  const [input, setInput] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const inputRef = useRef(null);
  const autoTimerRef = useRef(null);

  const buildQuestion = useCallback(
    (excludeId) => {
      const source = filteredPoolWords;
      if (source.length === 0) return null;
      return pool === "all" ? pickSmartWord(source, stats, excludeId, category !== "all") : pool === "new" ? pickNextNewWord(source, stats, excludeId) : source[Math.floor(Math.random() * source.length)];
    },
    [pool, category, filteredPoolWords, stats]
  );
  const buildQuestionRef = useRef(buildQuestion);
  buildQuestionRef.current = buildQuestion;

  useEffect(() => {
    setQuestion(buildQuestionRef.current(null));
    setInput("");
    setRevealed(false);
    setShowExample(false);
    return () => clearTimeout(autoTimerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool, category]);

  useEffect(() => {
    if (inputRef.current && !revealed) inputRef.current.focus();
  }, [question, revealed]);

  const insertChar = (ch) => {
    const el = inputRef.current;
    if (!el) {
      setInput((s) => s + ch);
      return;
    }
    const start = el.selectionStart ?? input.length;
    const end = el.selectionEnd ?? input.length;
    const next = input.slice(0, start) + ch + input.slice(end);
    setInput(next);
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = start + ch.length;
    });
  };

  const next = useCallback(() => {
    clearTimeout(autoTimerRef.current);
    setQuestion((q) => buildQuestionRef.current(q?.id));
    setInput("");
    setRevealed(false);
    setShowExample(false);
  }, []);

  const check = () => {
    if (!question || revealed) return;
    const correct = germanAnswerIsCorrect(input, question, allVocab);
    setWasCorrect(correct);
    setRevealed(true);
    recordAttempt(question.id, correct);
    if (correct) autoTimerRef.current = setTimeout(() => next(), 1050);
  };

  const onKeyDown = (e) => {
    if (revealed) {
      if (e.key === "Enter") next();
      return;
    }
    if (e.key === "Enter") {
      check();
      return;
    }
    // number keys 1-7 insert the matching special character (ä ö ü ß Ä Ö Ü), shown on the buttons below
    const n = parseInt(e.key, 10);
    if (!isNaN(n) && n >= 1 && n <= SPECIAL_CHARS.length && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      insertChar(SPECIAL_CHARS[n - 1]);
    }
  };

  useEffect(() => () => clearTimeout(autoTimerRef.current), []);

  useEffect(() => {
    if (revealed && stats.audioAutoplay && question) {
      speak(question.artikel ? `${question.artikel} ${question.de}` : question.de);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed]);

  if (!question) return <EmptyState pool={pool} />;

  const artColor = ARTICLE_COLORS[question.artikel] || null;

  return (
    <div className="vh-card" style={styles.card}>
      {question.category && <span style={styles.categoryTag}>{CATEGORY_LABEL[question.category] || question.category}</span>}
      <div className="vh-qhead" style={styles.qHead}>
        <span className="vh-german-word" style={styles.germanWord}>{question.en}</span>
      </div>
      <div className="vh-pos-label" style={styles.posLabel}>{question.pos}</div>

      <input
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKeyDown}
        disabled={revealed}
        placeholder="Type the German word…"
        className="vh-active-input"
        style={{ ...styles.activeInput, ...(revealed ? (wasCorrect ? styles.inputCorrect : styles.inputWrong) : {}) }}
        autoComplete="off"
        spellCheck="false"
      />

      <div className="vh-special-row" style={styles.specialRow}>
        <span className="vh-special-label" style={styles.specialLabel}>Special characters (or press the number key)</span>
        {SPECIAL_CHARS.map((ch, i) => (
          <button key={ch} className="vh-btn" style={styles.specialBtn} onClick={() => insertChar(ch)} tabIndex={-1}>
            {ch} <span style={styles.specialNum}>{i + 1}</span>
          </button>
        ))}
      </div>


      {question.example && (
        <button
          type="button"
          className="vh-btn"
          style={styles.hintBox}
          onClick={() => setShowExample((s) => !s)}
          aria-expanded={showExample}
        >
          <Lightbulb size={14} color="#B5443B" />
          <span>{showExample ? <><strong>Example:</strong> {question.example}</> : "Tap for an example sentence"}</span>
        </button>
      )}

      {revealed && (
        <div className="vh-feedback-box" style={{ ...styles.feedbackBox, ...(wasCorrect ? styles.feedbackGood : styles.feedbackBad) }}>
          {wasCorrect ? <Check size={16} /> : <X size={16} />}
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
              {question.artikel && <span style={{ color: artColor?.text }}>{question.artikel}</span>}
              {question.de}
              <SpeakerBtn text={question.artikel ? `${question.artikel} ${question.de}` : question.de} size={13} />
            </div>
            {showExample && question.example && <div style={styles.exampleSmall}>{question.example}</div>}
          </div>
        </div>
      )}

      <div className="vh-card-footer" style={styles.cardFooter}>
        <span className="vh-footer-hint" style={styles.footerHint}>Enter to {revealed ? "continue" : "check"}</span>
        {!revealed ? (
          <button style={styles.checkBtn} className="vh-btn" onClick={check}>
            Check answer →
          </button>
        ) : (
          <button style={styles.nextBtn} className="vh-btn" onClick={next}>
            Next word →
          </button>
        )}
      </div>
    </div>
  );
}

function buildBatch(source, stats, size) {
  if (source.length === 0) return [];
  // Batch is built from words already learned or currently a problem, shuffled fresh on
  // every rebatch. If that's not enough to fill the batch, brand-new words are added in the
  // same list-order sequence Passive/Active use to trickle in new words.
  const reviewable = shuffle(
    source.filter((w) => {
      const s = stats.wordStats[w.id];
      return s && s.seen > 0;
    })
  );
  const usedIds = new Set(reviewable.map((w) => w.id));
  const brandNew = source
    .filter((w) => !usedIds.has(w.id))
    .sort((a, b) => source.indexOf(a) - source.indexOf(b));
  return [...reviewable, ...brandNew].slice(0, Math.min(size, source.length));
}

function scoreEmoji(pct) {
  if (pct >= 90) return { emoji: "🏆", text: "Excellent! Right on target." };
  if (pct >= 70) return { emoji: "🎉", text: "Great job, keep going." };
  if (pct >= 50) return { emoji: "🙂", text: "Good start — a bit more practice." };
  return { emoji: "😅", text: "No worries, try again." };
}

function GroupPractice({ vocab, stats, recordAttempt, locked }) {
  const [phase, setPhase] = useState("setup"); // setup | quiz | graded
  const [groupCategory, setGroupCategory] = useState("all");
  const [direction, setDirection] = useState("de-en");
  const [size, setSize] = useState(10);
  const [batch, setBatch] = useState([]);
  const [answers, setAnswers] = useState({});
  const [graded, setGraded] = useState(null); // { wordId: { given, correct } } after submit
  const inputRefs = useRef([]);

  const source = useMemo(() => (groupCategory === "all" ? vocab : vocab.filter((w) => w.category === groupCategory)), [vocab, groupCategory]);

  const start = () => {
    const b = buildBatch(source, stats, Math.min(size, stats.attemptsRemaining));
    setBatch(b);
    setAnswers({});
    setGraded(null);
    inputRefs.current = [];
    setPhase("quiz");
    setTimeout(() => inputRefs.current[0]?.focus(), 50);
  };

  const insertCharAt = (index, ch) => {
    const el = inputRefs.current[index];
    const cur = answers[batch[index].id] || "";
    if (!el) {
      setAnswers((a) => ({ ...a, [batch[index].id]: cur + ch }));
      return;
    }
    const start = el.selectionStart ?? cur.length;
    const end = el.selectionEnd ?? cur.length;
    const next = cur.slice(0, start) + ch + cur.slice(end);
    setAnswers((a) => ({ ...a, [batch[index].id]: next }));
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = start + ch.length;
    });
  };

  const onRowKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (index < batch.length - 1) inputRefs.current[index + 1]?.focus();
      else submit();
      return;
    }
    if (direction === "en-de") {
      const n = parseInt(e.key, 10);
      if (!isNaN(n) && n >= 1 && n <= SPECIAL_CHARS.length && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        insertCharAt(index, SPECIAL_CHARS[n - 1]);
      }
    }
  };

  const submit = () => {
    const result = {};
    batch.forEach((w) => {
      const given = (answers[w.id] || "").trim();
      const correct = direction === "de-en"
        ? englishAnswerIsCorrect(given, w)
        : germanAnswerIsCorrect(given, w, vocab);
      result[w.id] = { given, correct };
      recordAttempt(w.id, correct);
    });
    setGraded(result);
    setPhase("graded");
  };

  if (phase === "setup") {
    return (
      <div className="vh-card vh-group-card" style={styles.card}>
        <h2 className="vh-group-title" style={styles.sectionTitle}>Group practice</h2>
        <p style={styles.helperText}>Fill in a whole batch of words at once, then submit together and see your score.</p>

        <div className="vh-group-settings" style={styles.settingsRow}>
          <label style={styles.settingsLabel}>
            Category
            <select value={groupCategory} onChange={(e) => setGroupCategory(e.target.value)} style={{ ...styles.select, width: 180 }}>
              <option value="all">All categories</option>
              {CATEGORY_LIST.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
          <label style={styles.settingsLabel}>
            Batch size
            <select value={size} onChange={(e) => setSize(parseInt(e.target.value, 10))} style={{ ...styles.select, width: 100 }}>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
            </select>
          </label>
        </div>

        <div className="vh-group-direction" style={{ marginTop: 4, marginBottom: 18 }}>
          <div style={{ ...styles.settingsLabel, marginBottom: 8 }}>Direction</div>
          <div className="vh-group-dir-buttons" style={{ display: "flex", gap: 8 }}>
            <button className="vh-btn vh-group-dir-btn" style={{ ...styles.dirBtn, ...(direction === "de-en" ? styles.dirBtnActive : {}) }} onClick={() => setDirection("de-en")}>
              German → English
            </button>
            <button className="vh-btn vh-group-dir-btn" style={{ ...styles.dirBtn, ...(direction === "en-de" ? styles.dirBtnActive : {}) }} onClick={() => setDirection("en-de")}>
              English → German
            </button>
          </div>
        </div>

        {locked ? (
          <p style={{ ...styles.helperText, color: "#B5443B" }}>No attempts remaining today. Your daily attempts reset tomorrow.</p>
        ) : source.length === 0 ? (
          <p style={styles.helperText}>No words in this category yet.</p>
        ) : (
          <button style={styles.checkBtn} className="vh-btn vh-group-start" onClick={start}>
            Start batch ({Math.min(size, source.length)} words) →
          </button>
        )}
      </div>
    );
  }

  if (phase === "quiz") {
    const filledCount = batch.filter((w) => (answers[w.id] || "").trim().length > 0).length;
    return (
      <div className="vh-card vh-group-card" style={styles.card}>
        <div className="vh-group-progress" style={styles.batchProgress}>
          <span>
            {direction === "de-en" ? "German → English" : "English → German"} · {filledCount} of {batch.length} filled
          </span>
          <div style={styles.progressTrack}>
            <div style={{ ...styles.progressFill, width: `${(filledCount / batch.length) * 100}%`, background: "#D4A94F" }} />
          </div>
        </div>

        <div className="vh-group-worksheet" style={styles.worksheetList}>
          {batch.map((w, i) => {
            const artColor = ARTICLE_COLORS[w.artikel] || null;
            const prompt = direction === "de-en" ? w.de : w.en;
            return (
              <div key={w.id} className="vh-worksheet-row" style={styles.worksheetRow}>
                <span style={styles.worksheetIndex}>{i + 1}</span>
                <div style={styles.worksheetPrompt}>
                  {direction === "de-en" && w.artikel && (
                    <span style={{ ...styles.artikelBadgeSmall, color: artColor.text, background: artColor.bg, borderColor: artColor.border }}>
                      {w.artikel}
                    </span>
                  )}
                  <span style={styles.worksheetWord}>{prompt}</span>
                  {direction === "de-en" && <SpeakerBtn text={w.artikel ? `${w.artikel} ${w.de}` : w.de} size={13} />}
                </div>
                <input
                  ref={(el) => (inputRefs.current[i] = el)}
                  className="vh-worksheet-input"
                  value={answers[w.id] || ""}
                  onChange={(e) => setAnswers((a) => ({ ...a, [w.id]: e.target.value }))}
                  onKeyDown={(e) => onRowKeyDown(e, i)}
                  placeholder={direction === "de-en" ? "English meaning…" : "German word…"}
                  style={styles.worksheetInput}
                  autoComplete="off"
                  spellCheck="false"
                />
              </div>
            );
          })}
        </div>

        {direction === "en-de" && (
          <div style={{ ...styles.specialRow, marginTop: 4 }}>
            <span className="vh-special-label" style={styles.specialLabel}>Tip: press the number key while typing to insert —</span>
            {SPECIAL_CHARS.map((ch, i) => (
              <span key={ch} style={styles.specialHintChip}>
                {ch}={i + 1}
              </span>
            ))}
          </div>
        )}

        <div style={{ ...styles.cardFooter, justifyContent: "flex-end" }}>
          <button style={styles.checkBtn} className="vh-btn" onClick={submit}>
            Submit all →
          </button>
        </div>
      </div>
    );
  }

  // graded
  const results = batch.map((w) => ({ word: w, ...graded[w.id] }));
  const correctCount = results.filter((r) => r.correct).length;
  const pct = Math.round((correctCount / results.length) * 100);
  const { emoji, text } = scoreEmoji(pct);

  return (
    <div className="vh-card vh-group-card" style={{ ...styles.card, textAlign: "center" }}>
      <div style={{ fontSize: 52, marginBottom: 4, animation: "vhPop .4s ease" }}>{emoji}</div>
      <div style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 700, color: "#1F2A44" }}>
        Your score: {correctCount}/{results.length} ({pct}%)
      </div>
      <div style={{ color: "#8A8474", fontSize: 13.5, marginTop: 4, marginBottom: 18 }}>{text}</div>

      <div className="vh-group-worksheet" style={{ ...styles.worksheetList, textAlign: "left", maxWidth: 520, margin: "0 auto" }}>
        {results.map((r, i) => (
          <div key={r.word.id} className="vh-worksheet-row" style={{ ...styles.worksheetRow, ...(r.correct ? styles.worksheetRowGood : styles.worksheetRowBad) }}>
            <span style={styles.worksheetIndex}>{i + 1}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={styles.worksheetWord}>
                  {direction === "de-en" ? (
                    <>
                      {r.word.artikel} {r.word.de}
                    </>
                  ) : (
                    r.word.en
                  )}
                </span>
                {r.correct ? <Check size={15} color="#3F7859" /> : <X size={15} color="#B5443B" />}
              </div>
              <div style={{ fontSize: 12.5, color: "#8A8474", marginTop: 2 }}>
                {r.given ? <>You wrote: "{r.given}"</> : <em>left blank</em>}
                {!r.correct && (
                  <>
                    {" · "}
                    Correct: <strong style={{ color: "#215339" }}>
                      {direction === "de-en"
                        ? r.word.en.replace(/^the\s+/i, "")
                        : displayGermanAnswers(r.word, vocab)}
                    </strong>
                  </>
                )}
              </div>
              {!r.correct && r.word.example && <div style={{ ...styles.exampleSmall, marginTop: 3 }}>💡 {r.word.example}</div>}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 22 }}>
        <button style={styles.nextBtn} className="vh-btn" onClick={start}>
          <RotateCcw size={14} style={{ marginRight: 6, verticalAlign: "-2px" }} />
          New batch
        </button>
        <button style={styles.addBtn} className="vh-btn" onClick={() => setPhase("setup")}>
          Change settings
        </button>
      </div>
    </div>
  );
}

function ManageVocab({ vocab, setVocab, stats, setStats, updateSettings }) {
  const [form, setForm] = useState({ de: "", artikel: "", pos: "noun", en: "", example: "", category: "custom" });
  const [bulkText, setBulkText] = useState("");
  const [bulkMsg, setBulkMsg] = useState("");
  const [listCategory, setListCategory] = useState("all");

  const existingKeys = useMemo(() => new Set(vocab.map((w) => `${w.de.trim().toLowerCase()}|${w.en.trim().toLowerCase()}`)), [vocab]);

  const addWord = () => {
    if (!form.de.trim() || !form.en.trim()) return;
    setVocab((prev) => [...prev, { id: uid(), ...form, de: form.de.trim(), en: form.en.trim() }]);
    setForm({ de: "", artikel: "", pos: "noun", en: "", example: "", category: "custom" });
  };

  const removeWord = (id) => {
    setVocab((prev) => prev.filter((w) => w.id !== id));
    setStats((prev) => {
      const ws = { ...prev.wordStats };
      delete ws[id];
      return { ...prev, wordStats: ws };
    });
  };

  const runBulkImport = () => {
    const lines = bulkText.split("\n").map((l) => l.trim()).filter(Boolean);
    const added = [];
    for (const line of lines) {
      const parts = line.split(/=|;|\t/).map((p) => p.trim());
      if (parts.length < 2) continue;
      let [left, right, example] = parts;
      let artikel = "";
      let de = left;
      const m = left.match(/^(der|die|das)\s+(.+)$/i);
      if (m) {
        artikel = m[1].toLowerCase();
        de = m[2];
      }
      const key = `${de.trim().toLowerCase()}|${right.trim().toLowerCase()}`;
      if (existingKeys.has(key)) continue;
      existingKeys.add(key);
      added.push({ id: uid(), de: de.trim(), artikel, pos: artikel ? "noun" : "other", en: right.trim(), example: (example || "").trim(), category: "custom" });
    }
    if (added.length > 0) {
      setVocab((prev) => [...prev, ...added]);
      setBulkMsg(`Added ${added.length} word${added.length === 1 ? "" : "s"}.`);
      setBulkText("");
    } else {
      setBulkMsg('Nothing new to add — check the format, e.g. "der Tag = day", or these are already in your list.');
    }
  };

  const visibleWords = listCategory === "all" ? vocab : vocab.filter((w) => w.category === listCategory);

  return (
    <div className="vh-card" style={styles.card}>
      <h2 style={styles.sectionTitle}>Practice settings</h2>
      <div style={styles.settingsRow}>
        <div style={styles.settingsLabel}>
          Daily attempts budget
          <div style={{ ...styles.settingsInput, display: "flex", alignItems: "center" }}>100</div>
        </div>
        <label style={styles.settingsLabel}>
          New words per day
          <input
            type="number"
            min={1}
            max={100}
            value={stats.newWordCap}
            onChange={(e) => updateSettings({ newWordCap: Math.max(1, parseInt(e.target.value, 10) || 1) })}
            style={styles.settingsInput}
          />
        </label>
      </div>
      <p style={styles.helperText}>
        Each correct answer adds 1 available attempt, up to 100. Each incorrect answer removes 1 attempt.
        On "All words", a word you get wrong stays flagged as a problem word — and keeps coming back — until you get it right {MASTERY_STREAK} times
        in a row. Correct words come back after a longer gap each time (1 day → 3 → 7 → 14 → 30), and new words
        trickle in a few at a time, in order, instead of all at once.
      </p>

      <div style={styles.divider} />

      <h2 style={styles.sectionTitle}>Add a word</h2>
      <div className="vh-add-form-grid" style={styles.addFormGrid}>
        <div style={styles.formField}>
          <label style={styles.fieldLabel}>Article</label>
          <select value={form.artikel} onChange={(e) => setForm({ ...form, artikel: e.target.value })} style={styles.select}>
            <option value="">no article</option>
            <option value="der">der</option>
            <option value="die">die</option>
            <option value="das">das</option>
          </select>
        </div>
        <div style={styles.formField}>
          <label style={styles.fieldLabel}>German word</label>
          <input placeholder="e.g. Apfel" value={form.de} onChange={(e) => setForm({ ...form, de: e.target.value })} style={styles.input} />
        </div>
        <div style={styles.formField}>
          <label style={styles.fieldLabel}>Part of speech</label>
          <select value={form.pos} onChange={(e) => setForm({ ...form, pos: e.target.value })} style={styles.select}>
            {POS_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div style={styles.formField}>
          <label style={styles.fieldLabel}>English meaning</label>
          <input placeholder="e.g. apple" value={form.en} onChange={(e) => setForm({ ...form, en: e.target.value })} style={styles.input} />
        </div>
        <div style={styles.formField}>
          <label style={styles.fieldLabel}>Category</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={styles.select}>
            {CATEGORY_LIST.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div style={{ ...styles.formField, gridColumn: "1 / -1" }}>
          <label style={styles.fieldLabel}>Example sentence (optional)</label>
          <input placeholder="e.g. Der Apfel ist rot." value={form.example} onChange={(e) => setForm({ ...form, example: e.target.value })} style={styles.input} />
        </div>
      </div>
      <button style={styles.addBtn} className="vh-btn" onClick={addWord}>
        <Plus size={15} /> Add word
      </button>

      <div style={styles.divider} />

      <h2 style={styles.sectionTitle}>Bulk import</h2>
      <p style={styles.helperText}>
        One word per line: <code style={styles.code}>der Tag = day</code> or{" "}
        <code style={styles.code}>laufen = to run = Ich laufe jeden Morgen.</code>
      </p>
      <textarea value={bulkText} onChange={(e) => setBulkText(e.target.value)} placeholder={"der Tag = day\ndie Nacht = night\nlaufen = to run"} style={styles.textarea} rows={4} />
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button style={styles.addBtn} className="vh-btn" onClick={runBulkImport}>
          Import lines
        </button>
        {bulkMsg && <span style={styles.helperText}>{bulkMsg}</span>}
      </div>

      <div style={styles.divider} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
        <h2 style={{ ...styles.sectionTitle, margin: 0 }}>Your words ({visibleWords.length})</h2>
        <select value={listCategory} onChange={(e) => setListCategory(e.target.value)} style={{ ...styles.select, width: 170 }}>
          <option value="all">All categories</option>
          {CATEGORY_LIST.map((c) => (
            <option key={c.key} value={c.key}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      <div style={styles.wordList}>
        {visibleWords.length === 0 && <div style={styles.helperText}>No words here yet.</div>}
        {visibleWords.map((w) => {
          const artColor = ARTICLE_COLORS[w.artikel];
          return (
            <div key={w.id} style={styles.wordRow}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, minWidth: 0 }}>
                {w.artikel && (
                  <span style={{ ...styles.artikelBadgeSmall, color: artColor.text, background: artColor.bg, borderColor: artColor.border }}>
                    {w.artikel}
                  </span>
                )}
                <span style={styles.wordDe}>{w.de}</span>
                <span style={styles.wordEn}>— {w.en}</span>
              </div>
              <button style={styles.trashBtn} onClick={() => removeWord(w.id)} aria-label={`Delete ${w.de}`}>
                <Trash2 size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatsPanel({ stats, trainedCount, totalWords, masteredCount, problemCount }) {
  const todayPct = stats.todayAttempts ? Math.round((stats.todayCorrect / stats.todayAttempts) * 100) : 0;
  const totalPct = stats.totalAttempts ? Math.round((stats.totalCorrect / stats.totalAttempts) * 100) : 0;
  const attemptsPct = stats.dailyLimit ? Math.round((stats.attemptsRemaining / stats.dailyLimit) * 100) : 0;

  return (
    <div className="vh-card vh-panel" style={styles.panel}>
      <h3 style={styles.panelTitle}>Statistics</h3>

      <div style={styles.statBlock}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={styles.statLabel}>
            <Zap size={11} style={{ verticalAlign: "-1px", marginRight: 3 }} />
            ATTEMPTS LEFT
          </div>
          {stats.streak > 0 && (
            <span style={{ fontSize: 11.5, color: "#D97B3C", fontWeight: 700, display: "flex", alignItems: "center", gap: 3 }}>
              <Flame size={12} /> {stats.streak}d
            </span>
          )}
        </div>
        <div style={styles.statRow}>
          <span>
            {stats.attemptsRemaining} of {stats.dailyLimit}
          </span>
        </div>
        <ProgressBar pct={attemptsPct} color={attemptsPct <= 20 ? "#B5443B" : "#D4A94F"} />
      </div>

      <div style={styles.statBlock}>
        <div style={styles.statLabel}>TODAY</div>
        <div style={styles.statRow}>
          <span>{stats.todayAttempts} attempts</span>
          <span style={styles.statPct}>{todayPct}%</span>
        </div>
        <ProgressBar pct={todayPct} />
      </div>
      <div style={styles.statBlock}>
        <div style={styles.statLabel}>TOTAL</div>
        <div style={styles.statRow}>
          <span>{stats.totalAttempts} attempts</span>
          <span style={styles.statPct}>{totalPct}%</span>
        </div>
        <ProgressBar pct={totalPct} />
      </div>
      <div style={styles.divider} />
      <div style={styles.wordsMeta}>
        <MetaRow label="Trained" value={`${trainedCount} of ${totalWords}`} />
        <MetaRow label="New today" value={`${stats.newWordsToday} of ${stats.newWordCap}`} />
        <MetaRow label="Mastered" value={masteredCount} />
        <MetaRow label="Problem" value={problemCount} />
      </div>
    </div>
  );
}

function MetaRow({ label, value }) {
  return (
    <div style={styles.metaRow}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
function ProgressBar({ pct, color }) {
  return (
    <div style={styles.progressTrack}>
      <div style={{ ...styles.progressFill, width: `${pct}%`, background: color || "#D4A94F" }} />
    </div>
  );
}

function VocabularyListPanel({ title, words }) {
  return (
    <div className="vh-card" style={styles.card}>
      <div className="vh-qhead" style={styles.qHead}>
        <BookOpen size={18} color="#B5443B" />
        <h2 style={{ ...styles.sectionTitle, margin: 0 }}>{title}</h2>
        <span style={styles.listCount}>{words.length}</span>
      </div>
      {words.length === 0 ? (
        <div style={{ ...styles.helperText, marginTop: 20 }}>No words in this list yet.</div>
      ) : (
        <div style={styles.vocabList}>
          {words.map((w, i) => {
            const artColor = ARTICLE_COLORS[w.artikel] || null;
            return (
              <div key={w.id} className="vh-vocab-list-row" style={styles.vocabListRow}>
                <span style={styles.worksheetIndex}>{i + 1}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                    {w.artikel && (
                      <span style={{ ...styles.artikelBadgeSmall, color: artColor?.text, background: artColor?.bg, borderColor: artColor?.border }}>
                        {w.artikel}
                      </span>
                    )}
                    <strong className="vh-vocab-list-german" style={styles.vocabListGerman}>{w.de}</strong>
                    <SpeakerBtn text={w.artikel ? `${w.artikel} ${w.de}` : w.de} size={12} />
                  </div>
                  <div className="vh-vocab-list-english" style={styles.vocabListEnglish}>{w.en}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ListsPanel({ pool, setPool, counts }) {
  const items = [
    { key: "all", label: "All words (smart mix)", icon: <BookOpen size={14} /> },
    { key: "problem", label: "Problem words", icon: <X size={14} /> },
    { key: "new", label: "New words", icon: <Sparkles size={14} /> },
    { key: "learned", label: "Learned", icon: <Check size={14} /> },
  ];
  return (
    <div className="vh-card vh-panel" style={styles.panel}>
      <h3 style={styles.panelTitle}>Practice list</h3>
      {items.map((it) => (
        <button key={it.key} onClick={() => setPool(it.key)} className="vh-btn" style={{ ...styles.listBtn, ...(pool === it.key ? styles.listBtnActive : {}) }}>
          <span style={styles.listBtnLeft}>
            {it.icon}
            {it.label}
          </span>
          <span style={styles.listCount}>{counts[it.key]}</span>
        </button>
      ))}
    </div>
  );
}

function CategoryPanel({ category, setCategory }) {
  return (
    <div className="vh-card vh-panel" style={styles.panel}>
      <h3 style={styles.panelTitle}>Categories</h3>
      <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ ...styles.select, width: "100%" }}>
        <option value="all">All</option>
        {CATEGORY_LIST.map((c) => (
          <option key={c.key} value={c.key}>
            {c.label}
          </option>
        ))}
      </select>
      <p style={{ ...styles.helperText, marginTop: 10, marginBottom: 0 }}>Filters Passive & Active practice.</p>
    </div>
  );
}

function EmptyState({ pool }) {
  const messages = {
    problem: "🎉 No problem words right now — everything's mastered in this category!",
    new: "You've seen every word in this category. Try another category or Group practice.",
    learned: "Nothing mastered here yet — keep practicing!",
  };
  return (
    <div className="vh-card" style={{ ...styles.card, textAlign: "center", color: "#7A7568" }}>
      <Home size={22} style={{ marginBottom: 8 }} />
      <div>{messages[pool] || "No words in this list yet. Add some in \u201cMy words\u201d."}</div>
    </div>
  );
}

const globalCss = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');
  .vh-btn { transition: transform .08s ease, box-shadow .08s ease, filter .08s ease; }
  .vh-btn:hover { filter: brightness(1.03); }
  .vh-btn:active { transform: translateY(1px); }
  .vh-option:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 14px rgba(31,42,68,0.10); }
  .vh-card { transition: box-shadow .15s ease; animation: vhFadeIn .25s ease; }
  .vh-speaker:hover { background: #EFE7D2 !important; }
  .vh-lofi-pulse { animation: vhLofiPulse 1.6s ease-in-out infinite; }
  @keyframes vhLofiPulse { 0%,100% { box-shadow: 0 0 0 0 rgba(212,169,79,0.5);} 50% { box-shadow: 0 0 0 6px rgba(212,169,79,0);} }
  .vh-spin { animation: vhSpin 0.9s linear infinite; }
  @keyframes vhSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .vh-modal-overlay { animation: vhFadeIn .15s ease; }
  @keyframes vhFadeIn { from { opacity: 0; transform: translateY(4px);} to { opacity: 1; transform: translateY(0);} }
  @keyframes vhPop { 0% { transform: scale(0.6); opacity: 0;} 60% { transform: scale(1.12); opacity: 1;} 100% { transform: scale(1);} }
  .vh-option-correct { animation: vhPop .35s ease; }
  .vh-option-wrong { animation: vhShake .3s ease; }
  @keyframes vhShake { 0%,100% { transform: translateX(0);} 25% { transform: translateX(-4px);} 75% { transform: translateX(4px);} }
  .vh-worksheet-row { animation: vhFadeIn .2s ease; }
  .vh-vocab-list-row { animation: vhFadeIn .18s ease; }
  .vh-vocab-list-row:hover { background: #FBF3E7 !important; }
  /* Base sizing / overflow protection */
  *, *::before, *::after { box-sizing: border-box; }
  html, body, #root { min-height: 100%; width: 100%; margin: 0; }
  body { overflow-x: hidden; }
  button, input, select, textarea { max-width: 100%; }

  @media (max-width: 780px) {
    .vh-grid { grid-template-columns: 1fr !important; }
    .vh-add-form-grid { grid-template-columns: 1fr !important; }
    .vh-card { padding: 38px 16px 20px !important; }
    .vh-card .vh-german-word {
      min-width: 0 !important;
      max-width: 100% !important;
      overflow-wrap: anywhere !important;
      word-break: normal !important;
    }
    .vh-card .vh-artikel-badge { flex-shrink: 0 !important; }
    .vh-card .vh-qhead {
      width: 100% !important;
      max-width: 100% !important;
      flex-wrap: wrap !important;
      row-gap: 7px !important;
      column-gap: 7px !important;
      padding: 0 4px !important;
    }
    .vh-category-tag { top: 14px !important; left: 16px !important; }
    .vh-options-grid { grid-template-columns: 1fr !important; }
    .vh-option { min-width: 0 !important; }
    .vh-option > span:not(.vh-option-num) { min-width: 0; overflow-wrap: anywhere; }
    .vh-card .vh-hint-box { width: 100% !important; max-width: 520px !important; }
    .vh-card .vh-card-footer { align-items: stretch !important; }
    .vh-card .vh-card-footer > * { max-width: 100%; }
    .vh-card .vh-card-footer button { width: 100%; }
    .vh-footer-hint { line-height: 1.45; }

    .vh-header-row {
      align-items: center !important;
      gap: 10px !important;
      flex-wrap: wrap !important;
    }
    .vh-brand-row {
      min-width: 0 !important;
    }
    .vh-header-controls {
      gap: 5px !important;
      flex-shrink: 0 !important;
      margin-left: auto !important;
    }
    .vh-title { font-size: 29px !important; }
    .vh-subtitle { font-size: 13px !important; }
    .vh-volume-slider { width: 56px !important; }
    .vh-flag-dot { display: none !important; }

    .vh-tabs { gap: 7px !important; }
    .vh-tab-btn {
      padding: 8px 12px !important;
      font-size: 12.5px !important;
      min-width: 0 !important;
      flex: 0 1 auto !important;
    }

    .vh-example-box, .vh-hint-box {
      line-height: 1.45 !important;
      overflow-wrap: anywhere !important;
    }
    .vh-active-input {
      width: 100% !important;
      font-size: 18px !important;
    }
    .vh-special-row { gap: 5px !important; }
    .vh-special-label { width: 100% !important; margin-right: 0 !important; text-align: center !important; line-height: 1.4; }
    .vh-feedback-box { width: 100% !important; }
    .vh-worksheet-row { align-items: stretch !important; }
    .vh-worksheet-prompt { min-width: 0 !important; flex: 1 1 100% !important; }
    .vh-worksheet-input { min-width: 0 !important; width: 100% !important; }
  }

  /* Group Practice mobile layout: compact, readable, touch-friendly */
  .vh-group-settings { align-items: flex-end; }
  .vh-group-settings select { max-width: 100%; }
  .vh-group-dir-buttons { width: 100%; }
  .vh-group-dir-btn { min-width: 0; }
  .vh-group-start { min-height: 42px; }

  @media (max-width: 780px) {
    .vh-group-card { overflow: hidden !important; }
    .vh-group-settings { display: grid !important; grid-template-columns: minmax(0, 1fr) 92px !important; gap: 10px !important; width: 100% !important; }
    .vh-group-settings > label { min-width: 0 !important; }
    .vh-group-settings select { width: 100% !important; min-width: 0 !important; }
    .vh-group-dir-buttons { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 8px !important; }
    .vh-group-dir-btn { width: 100% !important; padding: 10px 8px !important; font-size: 12.5px !important; line-height: 1.25 !important; white-space: normal !important; }
    .vh-group-start { width: 100% !important; }
    .vh-group-worksheet { gap: 6px !important; }
    .vh-group-worksheet .vh-worksheet-row {
      display: grid !important;
      grid-template-columns: 24px minmax(0, 1fr) !important;
      align-items: center !important;
      column-gap: 8px !important;
      row-gap: 7px !important;
      padding: 9px 10px !important;
    }
    .vh-group-worksheet .vh-worksheet-index { grid-column: 1; grid-row: 1; }
    .vh-group-worksheet .vh-worksheet-prompt {
      grid-column: 2 !important; grid-row: 1 !important;
      min-width: 0 !important; width: 100% !important; flex: none !important;
      overflow: hidden !important;
    }
    .vh-group-worksheet .vh-worksheet-word {
      font-size: 14px !important; line-height: 1.25 !important;
      overflow-wrap: anywhere !important; word-break: break-word !important;
    }
    .vh-group-worksheet .vh-worksheet-input {
      grid-column: 1 / -1 !important; grid-row: 2 !important;
      width: 100% !important; min-width: 0 !important;
      padding: 9px 10px !important; font-size: 14px !important;
      height: 40px !important;
    }
    .vh-group-worksheet .vh-artikel-badge-small { font-size: 10px !important; }
  }

  @media (max-width: 480px) {
    .vh-page { padding: 14px 10px 28px !important; }
    .vh-card { border-radius: 15px !important; padding: 38px 13px 16px !important; }
    .vh-panel { padding: 16px !important; }
    .vh-title { font-size: 27px !important; }
    .vh-chip-row { gap: 6px !important; margin-bottom: 14px !important; }
    .vh-chip { font-size: 11.5px !important; padding: 5px 9px !important; }
    .vh-tabs {
      display: grid !important;
      grid-template-columns: 1fr 1fr !important;
      gap: 8px !important;
      margin-bottom: 14px !important;
    }
    .vh-tab-btn {
      padding: 9px 6px !important;
      font-size: 12px !important;
      width: 100% !important;
      flex: none !important;
      justify-content: center !important;
      text-align: center !important;
    }
    .vh-german-word { font-size: 23px !important; line-height: 1.15 !important; text-align: center !important; }
    .vh-artikel-badge { font-size: 13px !important; padding: 3px 8px !important; }
    .vh-qhead { justify-content: center !important; }
    .vh-pos-label { margin-top: 5px !important; }
    .vh-option { padding: 12px 11px !important; font-size: 14px !important; line-height: 1.35 !important; }
    .vh-vocab-list-row { align-items: flex-start !important; }
    .vh-vocab-list-german { font-size: 14px !important; }
    .vh-vocab-list-english { font-size: 12px !important; overflow-wrap: anywhere; }
    .vh-worksheet-row { flex-wrap: wrap !important; }
    .vh-worksheet-row .vh-worksheet-input { flex-basis: 100%; }
    .vh-coffee-footer { padding: 20px 14px !important; }
  }

  @media (max-width: 360px) {
    .vh-header-row { align-items: flex-start !important; }
    .vh-title { font-size: 25px !important; }
    .vh-subtitle { font-size: 12px !important; }
    .vh-icon-toggle { width: 30px !important; height: 30px !important; }
    .vh-tab-btn { padding: 8px 5px !important; font-size: 11px !important; gap: 4px !important; }
    .vh-chip { font-size: 11px !important; }
  }
`;

const styles = {
  page: { minHeight: "100%", background: "#F7F3EA", fontFamily: "'Inter', system-ui, sans-serif", color: "#2A2620", padding: "20px 16px 40px" },
  container: { maxWidth: 980, margin: "0 auto" },
  loadingWrap: { display: "flex", alignItems: "center", justifyContent: "center", height: "100%", padding: 40 },
  loadingCard: { fontFamily: "'Fraunces', serif", color: "#7A7568" },
  coffeeFooter: {
    marginTop: 32,
    padding: "24px 20px",
    borderRadius: 16,
    background: "#FFF8EC",
    border: "1px solid #F0DFC0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    textAlign: "center",
  },
  coffeeText: { fontSize: 13.5, color: "#8A7248" },
  coffeeLink: {
    display: "inline-block",
    padding: "10px 20px",
    borderRadius: 999,
    background: "#FFDD00",
    color: "#2A2620",
    fontWeight: 700,
    fontSize: 14,
    textDecoration: "none",
    border: "1px solid #E8C700",
  },
  coffeeQr: { width: 140, height: 140, borderRadius: 10, border: "1px solid #F0DFC0", marginTop: 4 },
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 },
  brandRow: { display: "flex", alignItems: "center", gap: 12 },
  logo: { width: 44, height: 44, borderRadius: 12, flexShrink: 0 },
  title: { fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 700, margin: 0, color: "#1F2A44" },
  subtitle: { margin: "4px 0 0", color: "#8A8474", fontSize: 14 },
  flagDot: { display: "flex", gap: 4 },
  headerControls: { display: "flex", alignItems: "center", gap: 8 },
  iconToggle: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    border: "1px solid #E4DDCB",
    background: "#FFFFFF",
    color: "#8A8474",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 1px 2px rgba(31,42,68,0.05)",
  },
  iconToggleActive: { background: "linear-gradient(180deg,#E0B565,#D4A94F)", color: "#3A2C0B", borderColor: "#D4A94F" },
  volumeSlider: { width: 70, accentColor: "#D4A94F" },
  accountBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    height: 32,
    padding: "0 12px",
    borderRadius: 999,
    border: "1px solid #E4DDCB",
    background: "#FFFFFF",
    color: "#2A2620",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 1px 2px rgba(31,42,68,0.05)",
  },
  accountWrap: { position: "relative", display: "flex", alignItems: "center", gap: 6 },
  accountName: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 13,
    fontWeight: 600,
    color: "#2A2620",
    maxWidth: 140,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  avatarBtn: {
    padding: 0,
    border: "none",
    background: "transparent",
    borderRadius: "50%",
    cursor: "pointer",
    lineHeight: 0,
  },
  accountPopover: {
    position: "absolute",
    top: "calc(100% + 10px)",
    right: 0,
    zIndex: 60,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    width: 220,
    padding: "18px 16px 16px",
    borderRadius: 14,
    background: "#FFFFFF",
    border: "1px solid #E4DDCB",
    boxShadow: "0 12px 28px rgba(31,42,68,0.18)",
    textAlign: "center",
    animation: "vhFadeIn .15s ease",
  },
  accountPopoverName: {
    marginTop: 10,
    fontFamily: "'Fraunces', serif",
    fontWeight: 700,
    fontSize: 16,
    color: "#1F2A44",
    maxWidth: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  accountPopoverEmail: {
    fontSize: 12.5,
    color: "#8A8474",
    maxWidth: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  accountPopoverSync: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    fontSize: 11.5,
    marginTop: 6,
  },
  accountPopoverLogout: {
    marginTop: 14,
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 34,
    borderRadius: 999,
    border: "1px solid #E4DDCB",
    background: "#FBF3E7",
    color: "#B5443B",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(31,42,68,0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    zIndex: 50,
  },
  modalCard: { width: "100%", maxWidth: 380, padding: "36px 26px 26px" },
  modalClose: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 28,
    height: 28,
    borderRadius: "50%",
    border: "1px solid #E4DDCB",
    background: "#FFFFFF",
    color: "#8A8474",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  modalIconBadge: {
    width: 48,
    height: 48,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 14px",
    background: "linear-gradient(180deg,#28345A,#1F2A44)",
    color: "#FBF8F1",
    boxShadow: "0 4px 12px rgba(31,42,68,0.28)",
  },
  modalTitle: { fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 700, margin: "0 0 6px", color: "#1F2A44", textAlign: "center" },
  modalSubtitle: { margin: "0 0 20px", fontSize: 13, color: "#8A8474", lineHeight: 1.5, textAlign: "center" },
  authForm: { display: "flex", flexDirection: "column", gap: 10 },
  inputGroup: { position: "relative", display: "flex", alignItems: "center" },
  inputIcon: { position: "absolute", left: 12, color: "#A39C88", pointerEvents: "none" },
  inputWithIcon: {
    width: "100%",
    padding: "10px 12px 10px 36px",
    borderRadius: 8,
    border: "1px solid #E4DDCB",
    fontSize: 13.5,
    fontFamily: "inherit",
    color: "#2A2620",
  },
  passwordToggle: {
    position: "absolute",
    right: 10,
    background: "none",
    border: "none",
    color: "#A39C88",
    cursor: "pointer",
    padding: 4,
    display: "flex",
    alignItems: "center",
  },
  forgotLink: {
    alignSelf: "flex-end",
    background: "none",
    border: "none",
    color: "#3D5A8A",
    fontSize: 12.5,
    fontWeight: 600,
    cursor: "pointer",
    padding: "2px 0",
    marginTop: -2,
  },
  backLink: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    background: "none",
    border: "none",
    color: "#8A8474",
    fontSize: 12.5,
    fontWeight: 600,
    cursor: "pointer",
    padding: "0 0 2px",
    marginBottom: 2,
    alignSelf: "flex-start",
  },
  modalToggle: {
    marginTop: 14,
    width: "100%",
    textAlign: "center",
    background: "none",
    border: "none",
    color: "#3D5A8A",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    padding: 6,
  },
  chipRow: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 },
  chip: { display: "flex", alignItems: "center", gap: 5, background: "#FFFFFF", border: "1px solid #ECE5D3", borderRadius: 999, padding: "5px 12px", fontSize: 12.5, fontWeight: 600, color: "#5C5748", boxShadow: "0 1px 2px rgba(31,42,68,0.04)" },
  tabs: { display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" },
  tabBtn: { display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 999, border: "1px solid #E4DDCB", background: "#FFFFFF", color: "#5C5748", fontSize: 13.5, fontWeight: 600, cursor: "pointer", boxShadow: "0 1px 2px rgba(31,42,68,0.05)" },
  tabBtnActive: { background: "linear-gradient(180deg,#28345A,#1F2A44)", color: "#FBF8F1", borderColor: "#1F2A44", boxShadow: "0 3px 8px rgba(31,42,68,0.25)" },
  grid: { display: "grid", gridTemplateColumns: "minmax(0,1fr) 280px", gap: 18 },
  mainCol: { minWidth: 0 },
  sideCol: { display: "flex", flexDirection: "column", gap: 14 },
  card: { background: "linear-gradient(180deg,#FFFFFF,#FDFBF6)", border: "1px solid #ECE5D3", borderRadius: 18, padding: "28px 26px", boxShadow: "0 1px 2px rgba(31,42,68,0.05), 0 10px 28px rgba(31,42,68,0.06)", position: "relative" },
  categoryTag: { position: "absolute", top: 20, left: 26, fontSize: 10.5, textTransform: "uppercase", letterSpacing: 0.6, fontWeight: 700, color: "#A39C88", background: "#F5EFDF", padding: "3px 9px", borderRadius: 999 },
  qHead: { display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 6 },
  artikelBadge: { fontSize: 15, fontWeight: 700, padding: "3px 10px", borderRadius: 8, border: "1px solid" },
  artikelBadgeSmall: { fontSize: 11, fontWeight: 700, padding: "1px 6px", borderRadius: 6, border: "1px solid", flexShrink: 0 },
  germanWord: { fontFamily: "'Fraunces', serif", fontSize: 30, fontWeight: 700, color: "#1F2A44" },
  speakerBtn: { width: 30, height: 30, borderRadius: "50%", border: "1px solid #E4DDCB", background: "#FDFBF6", color: "#7A5A2B", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 },
  posLabel: { textAlign: "center", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.6, color: "#A39C88", marginTop: 6 },
  exampleBox: { display: "flex", alignItems: "center", gap: 8, margin: "18px auto 0", padding: "10px 16px", borderRadius: 10, background: "#FBF3E7", border: "1px dashed #E8D2A6", color: "#7A5A2B", fontSize: 13.5, maxWidth: 520, textAlign: "left" },
  vocabList: { display: "flex", flexDirection: "column", gap: 7, marginTop: 18, maxHeight: 620, overflowY: "auto", paddingRight: 3 },
  vocabListRow: { display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", border: "1px solid #ECE5D3", borderRadius: 10, background: "#FFFDF8" },
  vocabListGerman: { color: "#1F2A44", fontSize: 14.5 },
  vocabListEnglish: { color: "#8A8474", fontSize: 12.5, marginTop: 2 },
  hintBox: { display: "flex", alignItems: "center", gap: 8, margin: "18px auto 0", padding: "10px 16px", borderRadius: 10, background: "#FBF3E7", border: "1px dashed #E8D2A6", color: "#7A5A2B", fontSize: 13.5, fontStyle: "italic", cursor: "pointer", maxWidth: 520, textAlign: "left" },
  optionsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 22 },
  optionBtn: { display: "flex", alignItems: "center", gap: 10, padding: "13px 14px", borderRadius: 10, border: "1px solid #E4DDCB", background: "linear-gradient(180deg,#FFFFFF,#FDFBF6)", fontSize: 15, fontWeight: 600, color: "#2A2620", cursor: "pointer", textAlign: "left", boxShadow: "0 1px 2px rgba(31,42,68,0.05)" },
  optionCorrect: { background: "#E9F3ED", borderColor: "#3F7859", color: "#215339" },
  optionWrong: { background: "#FBEAEA", borderColor: "#B5443B", color: "#8A3229" },
  optionNum: { width: 20, height: 20, borderRadius: 6, background: "#F0EBDD", color: "#8A8474", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  cardFooter: { display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 22, flexWrap: "wrap", gap: 10 },
  footerHint: { fontSize: 12.5, color: "#A39C88" },
  nextBtn: { background: "linear-gradient(180deg,#E0B565,#D4A94F)", color: "#3A2C0B", border: "none", borderRadius: 10, padding: "10px 18px", fontWeight: 700, fontSize: 13.5, cursor: "pointer", boxShadow: "0 3px 8px rgba(212,169,79,0.35)" },
  checkBtn: { background: "linear-gradient(180deg,#28345A,#1F2A44)", color: "#FBF8F1", border: "none", borderRadius: 10, padding: "10px 18px", fontWeight: 700, fontSize: 13.5, cursor: "pointer", boxShadow: "0 3px 8px rgba(31,42,68,0.3)" },
  activeInput: { display: "block", width: "100%", maxWidth: 420, margin: "22px auto 0", padding: "12px 16px", fontSize: 20, fontFamily: "'Fraunces', serif", textAlign: "center", borderRadius: 10, border: "1.5px solid #E4DDCB", outline: "none", color: "#1F2A44", boxShadow: "inset 0 1px 3px rgba(31,42,68,0.06)" },
  inputCorrect: { borderColor: "#3F7859", background: "#F3FAF6" },
  inputWrong: { borderColor: "#B5443B", background: "#FDF4F3" },
  specialRow: { display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 14, flexWrap: "wrap" },
  specialLabel: { fontSize: 11.5, color: "#A39C88", marginRight: 4 },
  specialBtn: { padding: "6px 9px", borderRadius: 8, border: "1px solid #E4DDCB", background: "#FDFBF6", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#3A3626" },
  specialNum: { fontSize: 9, color: "#B8B096", marginLeft: 2 },
  feedbackBox: { display: "flex", gap: 10, alignItems: "flex-start", marginTop: 20, padding: "12px 16px", borderRadius: 10, maxWidth: 460, marginLeft: "auto", marginRight: "auto" },
  feedbackGood: { background: "#E9F3ED", color: "#215339" },
  feedbackBad: { background: "#FBEAEA", color: "#8A3229" },
  exampleSmall: { fontSize: 12.5, fontStyle: "italic", opacity: 0.85, marginTop: 2 },
  sectionTitle: { fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 700, margin: "0 0 12px", color: "#1F2A44" },
  settingsRow: { display: "flex", gap: 20, marginBottom: 10, flexWrap: "wrap" },
  settingsLabel: { display: "flex", flexDirection: "column", gap: 6, fontSize: 12.5, color: "#5C5748", fontWeight: 600 },
  settingsInput: { padding: "8px 10px", borderRadius: 8, border: "1px solid #E4DDCB", fontSize: 14, width: 110, fontFamily: "inherit", color: "#2A2620" },
  dirBtn: { flex: 1, padding: "10px 14px", borderRadius: 10, border: "1px solid #E4DDCB", background: "#FFFFFF", fontSize: 13.5, fontWeight: 600, color: "#5C5748", cursor: "pointer" },
  dirBtnActive: { background: "linear-gradient(180deg,#28345A,#1F2A44)", color: "#FBF8F1", borderColor: "#1F2A44" },
  batchProgress: { marginBottom: 16, fontSize: 12, color: "#A39C88", display: "flex", flexDirection: "column", gap: 6 },
  worksheetList: { display: "flex", flexDirection: "column", gap: 8, marginBottom: 6 },
  worksheetRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid #ECE5D3",
    background: "#FDFBF6",
  },
  worksheetRowGood: { background: "#F2F9F4", borderColor: "#CFE6D8" },
  worksheetRowBad: { background: "#FDF3F2", borderColor: "#F2CFC9" },
  worksheetIndex: {
    width: 22,
    height: 22,
    borderRadius: 6,
    background: "#F0EBDD",
    color: "#8A8474",
    fontSize: 11,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  worksheetPrompt: { display: "flex", alignItems: "center", gap: 6, minWidth: 150, flexShrink: 0 },
  worksheetWord: { fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 16, color: "#1F2A44" },
  worksheetInput: {
    flex: 1,
    minWidth: 0,
    padding: "9px 12px",
    borderRadius: 8,
    border: "1px solid #E4DDCB",
    fontSize: 14,
    fontFamily: "inherit",
    color: "#2A2620",
    background: "#FFFFFF",
  },
  specialHintChip: { fontSize: 11.5, color: "#7A5A2B", background: "#FBF3E7", border: "1px solid #E8D2A6", borderRadius: 6, padding: "2px 6px" },
  addFormGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 },
  formField: { display: "flex", flexDirection: "column", gap: 5 },
  fieldLabel: { fontSize: 11.5, fontWeight: 700, color: "#A39C88", textTransform: "uppercase", letterSpacing: 0.4 },
  input: { padding: "10px 12px", borderRadius: 8, border: "1px solid #E4DDCB", fontSize: 13.5, fontFamily: "inherit", color: "#2A2620" },
  select: { padding: "10px 10px", borderRadius: 8, border: "1px solid #E4DDCB", fontSize: 13.5, fontFamily: "inherit", color: "#2A2620", background: "#FFFFFF" },
  addBtn: { display: "flex", alignItems: "center", gap: 6, background: "linear-gradient(180deg,#28345A,#1F2A44)", color: "#FBF8F1", border: "none", borderRadius: 9, padding: "9px 16px", fontSize: 13.5, fontWeight: 700, cursor: "pointer", boxShadow: "0 3px 8px rgba(31,42,68,0.25)" },
  divider: { height: 1, background: "#ECE5D3", margin: "22px 0" },
  helperText: { fontSize: 12.5, color: "#A39C88", marginBottom: 10, lineHeight: 1.5 },
  code: { background: "#F0EBDD", padding: "1px 6px", borderRadius: 5, fontSize: 12 },
  textarea: { width: "100%", borderRadius: 8, border: "1px solid #E4DDCB", padding: 10, fontSize: 13, fontFamily: "monospace", marginBottom: 10, resize: "vertical", color: "#2A2620" },
  wordList: { display: "flex", flexDirection: "column", gap: 6, maxHeight: 320, overflowY: "auto" },
  wordRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "8px 10px", borderRadius: 8, background: "#FDFBF6", border: "1px solid #F0EBDD" },
  wordDe: { fontWeight: 700, color: "#1F2A44", fontSize: 13.5 },
  wordEn: { color: "#8A8474", fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  trashBtn: { border: "none", background: "transparent", color: "#C9877D", cursor: "pointer", flexShrink: 0 },
  panel: { background: "linear-gradient(180deg,#FFFFFF,#FDFBF6)", border: "1px solid #ECE5D3", borderRadius: 18, padding: 20, boxShadow: "0 1px 2px rgba(31,42,68,0.05), 0 8px 20px rgba(31,42,68,0.05)" },
  panelTitle: { fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 700, margin: "0 0 14px", color: "#1F2A44" },
  statBlock: { marginBottom: 16 },
  statLabel: { fontSize: 10.5, letterSpacing: 0.6, color: "#A39C88", fontWeight: 700, marginBottom: 4 },
  statRow: { display: "flex", justifyContent: "space-between", fontSize: 13.5, marginBottom: 6 },
  statPct: { fontWeight: 700, color: "#1F2A44" },
  progressTrack: { height: 6, borderRadius: 4, background: "#F0EBDD", overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 4, transition: "width .25s ease" },
  wordsMeta: { display: "flex", flexDirection: "column", gap: 8 },
  metaRow: { display: "flex", justifyContent: "space-between", fontSize: 13 },
  listBtn: { width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 10px", borderRadius: 9, border: "1px solid transparent", background: "transparent", fontSize: 13.5, color: "#5C5748", cursor: "pointer", marginBottom: 4 },
  listBtnActive: { background: "#F7F0DE", borderColor: "#E8D2A6", color: "#7A5A2B", fontWeight: 700 },
  listBtnLeft: { display: "flex", alignItems: "center", gap: 8 },
  listCount: { fontSize: 12, color: "#A39C88", fontWeight: 700 },
  saveError: { fontSize: 12, color: "#B5443B", background: "#FBEAEA", padding: 10, borderRadius: 8 },
  saveSuccess: { fontSize: 12, color: "#215339", background: "#E9F3ED", padding: 10, borderRadius: 8, lineHeight: 1.4 },
};
