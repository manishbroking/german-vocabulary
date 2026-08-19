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
  ["die", "Sekunde", "noun", "the second", "Eine Sekunde ist sehr kurz.", "time"],
  ["die", "Minute", "noun", "the minute", "Eine Minute hat sechzig Sekunden.", "time"],
  ["die", "Stunde", "noun", "the hour", "Eine Stunde hat sechzig Minuten.", "time"],
  ["der", "Tag", "noun", "the day", "Heute ist ein guter Tag.", "time"],
  ["die", "Woche", "noun", "the week", "Die Woche hat sieben Tage.", "time"],
  ["das", "Jahr", "noun", "the year", "Ein Jahr hat zwölf Monate.", "time"],
  ["der", "Wochentag", "noun", "the day of the week", "Das ist der Wochentag.", "time"],
  ["der", "Sonntag", "noun", "Sunday", "Am Sonntag schlafe ich länger.", "calendar"],
  ["der", "Montag", "noun", "Monday", "Am Montag arbeite ich.", "calendar"],
  ["der", "Dienstag", "noun", "Tuesday", "Am Dienstag lerne ich Deutsch.", "calendar"],
  ["der", "Mittwoch", "noun", "Wednesday", "Am Mittwoch habe ich Deutschkurs.", "calendar"],
  ["der", "Donnerstag", "noun", "Thursday", "Am Donnerstag arbeite ich.", "calendar"],
  ["der", "Freitag", "noun", "Friday", "Am Freitag treffe ich Freunde.", "calendar"],
  ["der", "Samstag", "noun", "Saturday", "Am Samstag gehe ich einkaufen.", "calendar"],
  ["das", "Wochenende", "noun", "the weekend", "Am Wochenende habe ich frei.", "time"],
  ["", "am Wochenende", "phrase", "at the weekend", "Am Wochenende lerne ich Deutsch.", "time"],
  ["der", "Morgen", "noun", "the morning", "Am Morgen trinke ich Kaffee.", "time"],
  ["der", "Vormittag", "noun", "the forenoon", "Am Vormittag lerne ich Deutsch.", "time"],
  ["der", "Mittag", "noun", "the noon", "Am Mittag esse ich.", "time"],
  ["der", "Nachmittag", "noun", "the afternoon", "Am Nachmittag lerne ich Deutsch.", "time"],
  ["der", "Abend", "noun", "the evening", "Am Abend bin ich zu Hause.", "time"],
  ["die", "Nacht", "noun", "the night", "Die Nacht ist ruhig.", "time"],
  ["der", "Januar", "noun", "January", "Im Januar ist es kalt.", "calendar"],
  ["der", "Februar", "noun", "February", "Im Februar ist es oft kalt.", "calendar"],
  ["der", "März", "noun", "March", "Im März beginnt der Frühling.", "calendar"],
  ["der", "April", "noun", "April", "Im April regnet es oft.", "calendar"],
  ["der", "Mai", "noun", "May", "Im Mai ist das Wetter schön.", "calendar"],
  ["der", "Juni", "noun", "June", "Im Juni ist es warm.", "calendar"],
  ["der", "Juli", "noun", "July", "Im Juli ist es heiß.", "calendar"],
  ["der", "August", "noun", "August", "Im August habe ich Urlaub.", "calendar"],
  ["der", "September", "noun", "September", "Im September beginnt die Schule.", "calendar"],
  ["der", "Oktober", "noun", "October", "Im Oktober ist es oft kühl.", "calendar"],
  ["der", "November", "noun", "November", "Im November wird es kalt.", "calendar"],
  ["der", "Dezember", "noun", "December", "Im Dezember ist Weihnachten.", "calendar"],
  ["die", "Jahreszeiten", "noun", "the seasons", "Das sind die Jahreszeiten.", "calendar"],
  ["der", "Frühling", "noun", "the spring", "Das ist der Frühling.", "calendar"],
  ["der", "Sommer", "noun", "the summer", "Das ist der Sommer.", "calendar"],
  ["der", "Herbst", "noun", "the autumn", "Das ist der Herbst.", "calendar"],
  ["der", "Winter", "noun", "the winter", "Das ist der Winter.", "calendar"],
  ["", "heute", "adverb", "today", "Heute lerne ich Deutsch.", "calendar"],
  ["", "Morgen", "adverb", "tomorrow", "Ich mache das Morgen.", "calendar"],
  ["", "Gestern", "adverb", "yesterday", "Ich mache das Gestern.", "calendar"],
  ["die", "Farben", "noun", "colours", "Das sind die Farben.", "other"],
  ["die", "Farbe", "noun", "the color", "Das ist die Farbe.", "other"],
  ["", "schwarz", "adjective", "black", "Das Auto ist schwarz.", "adjective"],
  ["", "weiß", "adjective", "white", "Das Haus ist weiß.", "adjective"],
  ["", "grau", "adjective", "grey", "Der Tisch ist grau.", "adjective"],
  ["", "blau", "adjective", "blue", "Das Auto ist blau.", "adjective"],
  ["", "grün", "adjective", "green", "Das Gras ist grün.", "adjective"],
  ["", "rot", "adjective", "red", "Der Apfel ist rot.", "adjective"],
  ["", "gelb", "adjective", "yellow", "Die Banane ist gelb.", "adjective"],
  ["", "braun", "adjective", "brown", "Der Tisch ist braun.", "adjective"],
  ["", "violett", "adjective", "violet", "Die Blume ist violett.", "adjective"],
  ["", "rosa", "adjective", "pink", "Das Kleid ist rosa.", "adjective"],
  ["", "dunkel", "adjective", "dark", "Das Zimmer ist dunkel.", "adjective"],
  ["", "hell", "adjective", "bright / light", "Das Zimmer ist hell.", "adjective"],
  ["", "Deutschland", "noun", "Germany", "Das ist Deutschland.", "places"],
  ["", "deutsch", "adjective", "German", "Ich lerne Deutsch.", "adjective"],
  ["", "Europa", "noun", "Europe", "Das ist Europa.", "places"],
  ["der", "Europäer", "noun", "European (male)", "Das ist der Europäer.", "people"],
  ["", "europäisch", "adjective", "European", "Das ist europäisch.", "adjective"],
  ["die", "Himmelsrichtungen", "noun", "cardinal directions", "Das sind die Himmelsrichtungen.", "places"],
  ["der", "Norden", "noun", "the north", "Das ist der Norden.", "places"],
  ["der", "Süden", "noun", "the south", "Das ist der Süden.", "places"],
  ["der", "Westen", "noun", "the west", "Das ist der Westen.", "places"],
  ["der", "Osten", "noun", "the east", "Das ist der Osten.", "places"],
  ["", "ab", "adverb", "from / starting from", "Ich mache das ab.", "other"],
  ["", "aber", "adverb", "but", "Ich mache das aber.", "other"],
  ["", "abfahren", "verb", "to leave / depart", "Der Zug fährt um acht Uhr ab.", "verb"],
  ["die", "Abfahrt", "noun", "the departure", "Das ist die Abfahrt.", "transport"],
  ["", "abgeben", "verb", "to hand over", "Ich möchte abgeben.", "verb"],
  ["", "abholen", "verb", "to pick up", "Ich hole dich am Bahnhof ab.", "verb"],
  ["der", "Absender", "noun", "the sender", "Das ist der Absender.", "other"],
  ["", "Achtung", "noun", "attention / danger", "Das ist Achtung.", "other"],
  ["die", "Adresse", "noun", "the address", "Hier ist meine Adresse.", "other"],
  ["", "allein", "adjective", "alone", "Das ist allein.", "adjective"],
  ["", "also", "adverb", "so / therefore", "Ich mache das also.", "adverb"],
  ["", "alt", "adjective", "old", "Das ist alt.", "adjective"],
  ["das", "Alter", "noun", "the age", "Das ist das Alter.", "other"],
  ["", "anbieten", "verb", "to offer", "Ich möchte anbieten.", "verb"],
  ["das", "Angebot", "noun", "the offer", "Das ist das Angebot.", "other"],
  ["", "ander", "adjective", "other", "Das ist ander.", "adjective"],
  ["", "anfangen", "verb", "to start / begin", "Der Kurs fängt um neun Uhr an.", "verb"],
  ["der", "Anfang", "noun", "the beginning", "Das ist der Anfang.", "other"],
  ["", "anklicken", "verb", "to click", "Ich klicke den Link an.", "verb"],
  ["", "ankommen", "verb", "to arrive", "Der Zug kommt um acht Uhr an.", "verb"],
  ["die", "Ankunft", "noun", "the arrival", "Das ist die Ankunft.", "transport"],
  ["", "ankreuzen", "verb", "to tick / mark", "Ich kreuze die Antwort an.", "verb"],
  ["", "anmachen", "verb", "to turn on", "Ich mache das Licht an.", "verb"],
  ["", "anmelden", "verb", "to register", "Ich melde mich an.", "verb"],
  ["die", "Anmeldung", "noun", "the registration", "Das ist die Anmeldung.", "other"],
  ["die", "Anrede", "noun", "the salutation", "Das ist die Anrede.", "other"],
  ["", "anrufen", "verb", "to call (phone)", "Ich rufe meine Mutter an.", "verb"],
  ["der", "Anruf", "noun", "the call", "Das ist der Anruf.", "other"],
  ["der", "Anrufbeantworter", "noun", "the answering machine", "Das ist der Anrufbeantworter.", "electronics"],
  ["die", "Ansage", "noun", "the announcement", "Das ist die Ansage.", "other"],
  ["der", "Anschluss", "noun", "the connection", "Das ist der Anschluss.", "other"],
  ["", "an sein", "verb", "to be turned on", "Ich möchte an sein.", "verb"],
  ["", "antworten", "verb", "to answer / reply", "Ich antworte auf die Frage.", "verb"],
  ["die", "Antwort", "noun", "the answer", "Das ist die Antwort.", "other"],
  ["die", "Anzeige", "noun", "the advertisement", "Das ist die Anzeige.", "other"],
  ["", "anziehen", "verb", "to put on (clothes)", "Ich ziehe meine Jacke an.", "verb"],
  ["das", "Apartment", "noun", "the apartment", "Das ist das Apartment.", "house"],
  ["der", "Apfel", "noun", "the apple", "Das ist der Apfel.", "food"],
  ["der", "Appetit", "noun", "the appetite", "Ich habe Appetit.", "food"],
  ["", "arbeiten", "verb", "to work", "Ich arbeite heute.", "verb"],
  ["die", "Arbeit", "noun", "the work / job", "Ich habe viel Arbeit.", "professions"],
  ["", "arbeitslos", "adjective", "unemployed", "Er ist arbeitslos.", "adjective"],
  ["der", "Arbeitsplatz", "noun", "the workplace / job", "Das ist der Arbeitsplatz.", "professions"],
  ["", "arm", "adjective", "poor", "Das ist arm.", "adjective"],
  ["der", "Arm", "noun", "the arm", "Das ist der Arm.", "body"],
  ["der", "Arzt", "noun", "the doctor", "Der Arzt hilft mir.", "professions"],
  ["", "auch", "adverb", "also / too", "Ich mache das auch.", "adverb"],
  ["", "auf", "adverb", "on / upon", "Ich mache das auf.", "other"],
  ["die", "Aufgabe", "noun", "the task / assignment", "Das ist die Aufgabe.", "other"],
  ["", "aufhören", "verb", "to stop / cease", "Ich höre jetzt auf.", "verb"],
  ["", "auf sein", "verb", "to be open", "Ich möchte auf sein.", "verb"],
  ["", "aufstehen", "verb", "to get up / stand up", "Ich stehe früh auf.", "verb"],
  ["der", "Aufzug", "noun", "the elevator / lift", "Das ist der Aufzug.", "house"],
  ["das", "Auge", "noun", "the eye", "Mein Auge tut weh.", "body"],
  ["die", "Augen", "noun", "the eyes", "Meine Augen sind müde.", "body"],
  ["", "aus", "adverb", "from / out of", "Ich mache das aus.", "other"],
  ["der", "Ausflug", "noun", "the excursion / trip", "Das ist der Ausflug.", "places"],
  ["", "ausfüllen", "verb", "to fill in (form)", "Ich fülle das Formular aus.", "verb"],
  ["der", "Ausgang", "noun", "the exit", "Das ist der Ausgang.", "places"],
  ["die", "Auskunft", "noun", "the information", "Das ist die Auskunft.", "other"],
  ["das", "Ausland", "noun", "abroad / foreign countries", "Das ist das Ausland.", "places"],
  ["der", "Ausländer", "noun", "the foreigner", "Das ist der Ausländer.", "people"],
  ["", "ausländisch", "adjective", "foreign", "Das ist ausländisch.", "adjective"],
  ["", "ausmachen", "verb", "to turn off", "Ich mache das Licht aus.", "verb"],
  ["die", "Aussage", "noun", "the statement", "Das ist die Aussage.", "other"],
  ["", "aussehen", "verb", "to look / appear", "Ich möchte aussehen.", "verb"],
  ["", "aus sein", "verb", "to be off", "Ich möchte aus sein.", "verb"],
  ["", "aussteigen", "verb", "to get off / exit", "Ich steige am Bahnhof aus.", "verb"],
  ["der", "Ausweis", "noun", "the ID card", "Das ist der Ausweis.", "other"],
  ["", "ausziehen", "verb", "to take off (clothes) / move out", "Ich ziehe meine Schuhe aus.", "verb"],
  ["das", "Auto", "noun", "the car", "Das ist mein Auto.", "transport"],
  ["die", "Autobahn", "noun", "the motorway / highway", "Das ist die Autobahn.", "transport"],
  ["der", "Automat", "noun", "the machine / dispenser", "Das ist der Automat.", "electronics"],
  ["", "automatisch", "adjective", "automatically", "Das ist automatisch.", "adjective"],
  ["das", "Baby", "noun", "the baby", "Das ist das Baby.", "people"],
  ["die", "Bäckerei", "noun", "the bakery", "Das ist die Bäckerei.", "places"],
  ["das", "Bad", "noun", "the bath", "Das ist das Bad.", "house"],
  ["", "baden", "verb", "to bathe / swim", "Ich bade gern.", "verb"],
  ["die", "Bahn", "noun", "the train / railway", "Das ist die Bahn.", "transport"],
  ["der", "Bahnhof", "noun", "the train station", "Der Bahnhof ist groß.", "transport"],
  ["der", "Bahnsteig", "noun", "the platform", "Das ist der Bahnsteig.", "transport"],
  ["", "bald", "adverb", "soon", "Ich komme bald.", "adverb"],
  ["der", "Balkon", "noun", "the balcony", "Das ist der Balkon.", "house"],
  ["die", "Banane", "noun", "the banana", "Das ist die Banane.", "food"],
  ["die", "Bank", "noun", "the bank / bench", "Das ist die Bank.", "places"],
  ["", "bar", "adjective", "cash (payment)", "Ich bezahle bar.", "adjective"],
  ["der", "Bauch", "noun", "the belly / stomach", "Das ist der Bauch.", "body"],
  ["der", "Baum", "noun", "the tree", "Das ist der Baum.", "other"],
  ["der", "Beamte", "noun", "the official / civil servant", "Das ist der Beamte.", "professions"],
  ["", "bedeuten", "verb", "to mean / signify", "Was bedeutet dieses Wort?", "verb"],
  ["", "beginnen", "verb", "to start / begin", "Der Kurs beginnt um neun Uhr.", "verb"],
  ["", "bei", "adverb", "at / near / with", "Ich mache das bei.", "other"],
  ["", "beide", "adjective", "both", "Das ist beide.", "adjective"],
  ["das", "Bein", "noun", "the leg", "Das ist das Bein.", "body"],
  ["das", "Beispiel", "noun", "the example", "Das ist das Beispiel.", "other"],
  ["", "zum Beispiel", "phrase", "for example", "Zum Beispiel lerne ich Deutsch.", "other"],
  ["", "bekannt", "adjective", "known / famous", "Das ist bekannt.", "adjective"],
  ["der", "Bekannte", "noun", "the acquaintance", "Das ist der Bekannte.", "people"],
  ["", "bekommen", "verb", "to get / receive", "Ich bekomme eine E-Mail.", "verb"],
  ["", "benutzen", "verb", "to use", "Ich benutze mein Handy.", "verb"],
  ["der", "Beruf", "noun", "the occupation / profession", "Das ist der Beruf.", "professions"],
  ["", "besetzt", "adjective", "occupied / busy", "Das ist besetzt.", "adjective"],
  ["", "besichtigen", "verb", "to inspect / visit", "Wir besichtigen das Haus.", "verb"],
  ["", "besser", "adjective", "better", "Das ist besser.", "adjective"],
  ["", "best", "adjective", "best", "Das ist best.", "adjective"],
  ["", "bestellen", "verb", "to order", "Ich bestelle eine Pizza.", "verb"],
  ["", "besuchen", "verb", "to visit", "Ich besuche meine Oma.", "verb"],
  ["das", "Bett", "noun", "the bed", "Das ist ein Bett.", "furniture"],
  ["", "bezahlen", "verb", "to pay", "Ich bezahle die Rechnung.", "verb"],
  ["das", "Bier", "noun", "the beer", "Er trinkt ein Bier.", "food"],
  ["das", "Bild", "noun", "the picture", "Das ist das Bild.", "furniture"],
  ["", "billig", "adjective", "cheap", "Das ist billig.", "adjective"],
  ["die", "Birne", "noun", "the pear", "Das ist die Birne.", "food"],
  ["", "bis", "adverb", "until / till", "Ich mache das bis.", "other"],
  ["", "bisschen", "adverb", "a little", "Ich mache das bisschen.", "adverb"],
  ["", "bitte", "phrase", "please", "Ich sage: „bitte.“", "other"],
  ["die", "Bitte", "noun", "the request", "Das ist die Bitte.", "other"],
  ["", "bitten", "verb", "to request / ask for", "Ich bitte um Hilfe.", "verb"],
  ["", "bitter", "adjective", "bitter", "Das ist bitter.", "adjective"],
  ["", "bleiben", "verb", "to stay / remain", "Ich bleibe zu Hause.", "verb"],
  ["der", "Bleistift", "noun", "the pencil", "Das ist ein Bleistift.", "stationery"],
  ["der", "Blick", "noun", "the view / glimpse", "Das ist der Blick.", "other"],
  ["die", "Blume", "noun", "the flower", "Das ist die Blume.", "other"],
  ["der", "Bogen", "noun", "the bow / sheet", "Das ist der Bogen.", "other"],
  ["", "böse", "adjective", "naughty / bad / angry", "Das ist böse.", "adjective"],
  ["", "brauchen", "verb", "to need", "Ich brauche Hilfe.", "verb"],
  ["", "breit", "adjective", "wide / broad", "Das ist breit.", "adjective"],
  ["der", "Brief", "noun", "the letter", "Das ist der Brief.", "stationery"],
  ["die", "Briefmarke", "noun", "the stamp", "Das ist die Briefmarke.", "stationery"],
  ["", "bringen", "verb", "to bring", "Ich bringe dir Wasser.", "verb"],
  ["das", "Brot", "noun", "the bread", "Das ist das Brot.", "food"],
  ["das", "Brötchen", "noun", "the bread roll", "Das ist das Brötchen.", "food"],
  ["der", "Bruder", "noun", "the brother", "Das ist mein Bruder.", "family"],
  ["das", "Buch", "noun", "the book", "Das Buch ist neu.", "stationery"],
  ["der", "Buchstabe", "noun", "the letter / alphabet character", "Das ist der Buchstabe.", "stationery"],
  ["", "buchstabieren", "verb", "to spell", "Ich buchstabiere meinen Namen.", "verb"],
  ["der", "Bus", "noun", "the bus", "Der Bus kommt.", "transport"],
  ["die", "Butter", "noun", "the butter", "Das ist die Butter.", "food"],
  ["das", "Café", "noun", "the café", "Das ist das Café.", "places"],
  ["die", "CD", "noun", "the CD", "Das ist die CD.", "electronics"],
  ["der", "Chef", "noun", "the boss / supervisor", "Das ist der Chef.", "professions"],
  ["", "circa", "adverb", "approximately", "Ich mache das circa.", "adverb"],
  ["der", "Computer", "noun", "the computer", "Das ist ein Computer.", "electronics"],
  ["", "da", "adverb", "there / because", "Ich mache das da.", "adverb"],
  ["die", "Dame", "noun", "the lady", "Das ist die Dame.", "people"],
  ["", "daneben", "adverb", "beside / next to it", "Der Stuhl steht daneben.", "adverb"],
  ["", "danken", "verb", "to thank", "Ich danke dir.", "verb"],
  ["der", "Dank", "noun", "the thanks / gratitude", "Das ist der Dank.", "other"],
  ["", "danke", "phrase", "thank you", "Ich sage: „danke.“", "other"],
  ["", "dann", "adverb", "then", "Ich mache das dann.", "adverb"],
  ["das", "Datum", "noun", "the date", "Welches Datum ist heute?", "time"],
  ["", "dauern", "verb", "to last / take time", "Der Kurs dauert eine Stunde.", "verb"],
  ["", "dein", "adjective", "your", "Das ist dein.", "other"],
  ["", "denn", "adverb", "because / for", "Ich mache das denn.", "other"],
  ["", "denken", "verb", "to think", "Ich denke an dich.", "verb"],
  ["", "der", "other", "the (masculine)", "Der Tisch ist groß.", "other"],
  ["", "die", "other", "the (feminine/plural)", "Die Tür ist offen.", "other"],
  ["", "das", "other", "the (neutral)", "Das Haus ist groß.", "other"],
  ["", "dich", "other", "you (accusative)", "Ich sehe dich.", "other"],
  ["", "dies", "other", "this", "Dies ist mein Platz.", "other"],
  ["", "dir", "other", "you (dative)", "Ich helfe dir.", "other"],
  ["die", "Disco", "noun", "the disco / club", "Das ist die Disco.", "places"],
  ["der", "Doktor", "noun", "the doctor", "Das ist der Doktor.", "professions"],
  ["das", "Doppelzimmer", "noun", "the double room", "Das ist das Doppelzimmer.", "house"],
  ["das", "Dorf", "noun", "the village", "Das ist das Dorf.", "places"],
  ["", "dort", "adverb", "there", "Ich wohne dort.", "adverb"],
  ["", "draußen", "adverb", "outside", "Ich bin draußen.", "adverb"],
  ["", "drucken", "verb", "to print", "Ich drucke das Papier.", "verb"],
  ["der", "Drucker", "noun", "the printer", "Das ist der Drucker.", "electronics"],
  ["", "drücken", "verb", "to push / press", "Drücken Sie bitte hier.", "verb"],
  ["", "durch", "adverb", "through", "Ich mache das durch.", "other"],
  ["die", "Durchsage", "noun", "the announcement", "Das ist die Durchsage.", "other"],
  ["", "dürfen", "verb", "may / to be allowed", "Darf ich hier sitzen?", "verb"],
  ["der", "Durst", "noun", "the thirst", "Ich habe Durst.", "food"],
  ["", "duschen", "verb", "to shower", "Ich dusche am Morgen.", "verb"],
  ["die", "Dusche", "noun", "the shower", "Das ist die Dusche.", "house"],
  ["die", "Ecke", "noun", "the corner", "Das ist die Ecke.", "house"],
  ["die", "Ehefrau", "noun", "the wife", "Das ist die Ehefrau.", "family"],
  ["der", "Ehemann", "noun", "the husband", "Das ist der Ehemann.", "family"],
  ["das", "Ei", "noun", "the egg", "Das ist das Ei.", "food"],
  ["", "eilig", "adjective", "urgent / in a hurry", "Das ist eilig.", "adjective"],
  ["", "ein", "other", "a / an / one", "Ich habe ein Buch.", "other"],
  ["", "einfach", "adjective", "simple / easy", "Die Aufgabe ist einfach.", "adjective"],
  ["der", "Eingang", "noun", "the entrance", "Das ist der Eingang.", "places"],
  ["", "einkaufen", "verb", "to shop / buy groceries", "Ich kaufe heute ein.", "verb"],
  ["", "einladen", "verb", "to invite", "Ich lade meine Freunde ein.", "verb"],
  ["die", "Einladung", "noun", "the invitation", "Das ist die Einladung.", "other"],
  ["", "einmal", "adverb", "once", "Ich mache das einmal.", "adverb"],
  ["", "einsteigen", "verb", "to get in / board", "Ich steige in den Bus ein.", "verb"],
  ["der", "Eintritt", "noun", "the admission / entry", "Das ist der Eintritt.", "places"],
  ["das", "Einzelzimmer", "noun", "the single room", "Das ist das Einzelzimmer.", "house"],
  ["die", "Eltern", "noun", "the parents", "Das sind die Eltern.", "family"],
  ["die", "E-Mail", "noun", "the email", "Das ist die E-Mail.", "electronics"],
  ["der", "Empfänger", "noun", "the recipient", "Das ist der Empfänger.", "other"],
  ["", "empfehlen", "verb", "to recommend", "Ich empfehle das Buch.", "verb"],
  ["", "enden", "verb", "to end", "Ich möchte enden.", "verb"],
  ["das", "Ende", "noun", "the end", "Das ist das Ende.", "other"],
  ["", "entschuldigen", "verb", "to apologize / excuse", "Entschuldigen Sie bitte.", "verb"],
  ["die", "Entschuldigung", "noun", "the apology / excuse", "Das ist die Entschuldigung.", "other"],
  ["", "er", "other", "he", "Er ist mein Freund.", "people"],
  ["das", "Ergebnis", "noun", "the result / outcome", "Das ist das Ergebnis.", "other"],
  ["", "erinnern", "verb", "to remember", "Ich erinnere mich daran.", "verb"],
  ["", "erklären", "verb", "to explain", "Der Lehrer erklärt das Wort.", "verb"],
  ["", "erlauben", "verb", "to allow / permit", "Ich möchte erlauben.", "verb"],
  ["der", "Erwachsene", "noun", "the adult", "Das ist der Erwachsene.", "people"],
  ["", "erzählen", "verb", "to tell / narrate", "Ich erzähle eine Geschichte.", "verb"],
  ["", "es", "other", "it", "Es ist kalt.", "other"],
  ["", "essen", "verb", "to eat", "Ich esse einen Apfel.", "verb"],
  ["das", "Essen", "noun", "the food / meal", "Das Essen ist gut.", "food"],
  ["", "etwas", "other", "something", "Ich möchte etwas essen.", "other"],
  ["", "euer", "other", "your (plural)", "Ist das euer Auto?", "other"],
  ["", "fahren", "verb", "to drive / ride", "Ich fahre mit dem Bus.", "verb"],
  ["der", "Fahrer", "noun", "the driver", "Das ist der Fahrer.", "professions"],
  ["die", "Fahrkarte", "noun", "the ticket", "Das ist die Fahrkarte.", "transport"],
  ["das", "Fahrrad", "noun", "the bicycle", "Das ist mein Fahrrad.", "transport"],
  ["", "falsch", "adjective", "wrong / false", "Das ist falsch.", "adjective"],
  ["die", "Familie", "noun", "the family", "Meine Familie ist groß.", "family"],
  ["der", "Familienname", "noun", "the surname", "Das ist der Familienname.", "family"],
  ["der", "Familienstand", "noun", "the marital status", "Das ist der Familienstand.", "family"],
  ["das", "Fax", "noun", "the fax", "Das ist das Fax.", "electronics"],
  ["die", "Feier", "noun", "the celebration", "Das ist die Feier.", "other"],
  ["", "feiern", "verb", "to celebrate", "Wir feiern Geburtstag.", "verb"],
  ["", "fehlen", "verb", "to be missing / lack", "Du fehlst mir.", "verb"],
  ["der", "Fehler", "noun", "the mistake / error", "Das ist der Fehler.", "other"],
  ["", "fernsehen", "verb", "to watch TV", "Ich sehe abends fern.", "verb"],
  ["der", "Fernseher", "noun", "the TV", "Der Fernseher ist an.", "electronics"],
  ["", "fertig", "adjective", "finished / ready", "Das ist fertig.", "adjective"],
  ["das", "Feuer", "noun", "the fire", "Das ist das Feuer.", "other"],
  ["das", "Fieber", "noun", "the fever", "Das ist das Fieber.", "body"],
  ["der", "Film", "noun", "the film / movie", "Das ist der Film.", "other"],
  ["", "finden", "verb", "to find", "Ich finde den Schlüssel.", "verb"],
  ["die", "Firma", "noun", "the company", "Das ist die Firma.", "professions"],
  ["der", "Fisch", "noun", "the fish", "Das ist der Fisch.", "food"],
  ["die", "Flasche", "noun", "the bottle", "Das ist die Flasche.", "tableware"],
  ["das", "Fleisch", "noun", "the meat", "Das ist das Fleisch.", "food"],
  ["", "fliegen", "verb", "to fly", "Ich möchte fliegen.", "verb"],
  ["", "abfliegen", "verb", "to take off / depart", "Ich möchte abfliegen.", "verb"],
  ["der", "Abflug", "noun", "the departure (flight)", "Das ist der Abflug.", "transport"],
  ["der", "Flughafen", "noun", "the airport", "Der Flughafen ist weit weg.", "places"],
  ["das", "Flugzeug", "noun", "the airplane", "Das Flugzeug fliegt.", "transport"],
  ["das", "Formular", "noun", "the form", "Das ist das Formular.", "stationery"],
  ["das", "Foto", "noun", "the photo", "Das ist das Foto.", "electronics"],
  ["", "fragen", "verb", "to ask", "Ich frage den Lehrer.", "verb"],
  ["die", "Frage", "noun", "the question", "Ich habe eine Frage.", "other"],
  ["die", "Frau", "noun", "the woman / wife", "Das ist die Frau.", "people"],
  ["", "fremd", "adjective", "foreign / strange", "Das ist fremd.", "adjective"],
  ["", "frei", "adjective", "free / vacant", "Das ist frei.", "adjective"],
  ["die", "Freizeit", "noun", "the free time", "Das ist die Freizeit.", "other"],
  ["", "sich freuen", "verb", "to be glad", "Ich freue mich.", "verb"],
  ["der", "Freund", "noun", "the friend", "Das ist mein Freund.", "people"],
  ["", "frisch", "adjective", "fresh", "Das Brot ist frisch.", "adjective"],
  ["", "früh", "adjective", "early", "Das ist früh.", "adjective"],
  ["", "früher", "adverb", "earlier / in the past", "Früher wohnte ich hier.", "adverb"],
  ["", "frühstücken", "verb", "to eat breakfast", "Ich möchte frühstücken.", "verb"],
  ["das", "Frühstück", "noun", "the breakfast", "Das ist das Frühstück.", "food"],
  ["die", "Führung", "noun", "the leadership / guided tour", "Das ist die Führung.", "other"],
  ["", "für", "other", "for", "Das Geschenk ist für dich.", "other"],
  ["der", "Fuß", "noun", "the foot", "Mein Fuß tut weh.", "body"],
  ["der", "Fußball", "noun", "the football / soccer", "Das ist der Fußball.", "other"],
  ["die", "Garage", "noun", "the garage", "Das ist die Garage.", "house"],
  ["der", "Garten", "noun", "the garden", "Der Garten ist schön.", "house"],
  ["der", "Gast", "noun", "the guest", "Das ist der Gast.", "people"],
  ["", "geben", "verb", "to give", "Gib mir bitte das Buch.", "verb"],
  ["", "geboren", "adjective", "born", "Ich bin in Indien geboren.", "other"],
  ["das", "Geburtsjahr", "noun", "the year of birth", "Das ist das Geburtsjahr.", "time"],
  ["der", "Geburtsort", "noun", "the place of birth", "Das ist der Geburtsort.", "places"],
  ["der", "Geburtstag", "noun", "the birthday", "Heute ist mein Geburtstag.", "calendar"],
  ["", "gefallen", "verb", "to please / to like", "Der Film gefällt mir.", "verb"],
  ["", "gegen", "other", "against", "Wir spielen gegen eine andere Mannschaft.", "other"],
  ["", "gehen", "verb", "to go / walk", "Ich gehe nach Hause.", "verb"],
  ["", "gehören", "verb", "to belong to", "Das Buch gehört mir.", "verb"],
  ["das", "Geld", "noun", "the money", "Ich brauche Geld.", "other"],
  ["das", "Gemüse", "noun", "the vegetables", "Das sind die Gemüse.", "food"],
  ["das", "Gepäck", "noun", "the luggage", "Das ist das Gepäck.", "transport"],
  ["", "gerade", "adverb", "just / straight", "Ich esse gerade.", "adverb"],
  ["", "geradeaus", "adverb", "straight ahead", "Gehen Sie geradeaus.", "adverb"],
  ["", "gern", "adverb", "gladly / with pleasure", "Ich helfe gern.", "adverb"],
  ["das", "Geschäft", "noun", "the business / shop", "Das Geschäft ist offen.", "places"],
  ["das", "Geschenk", "noun", "the gift / present", "Das ist das Geschenk.", "other"],
  ["das", "Gesicht", "noun", "the face", "Ich wasche mein Gesicht.", "body"],
  ["die", "Geschwister", "noun", "the siblings", "Das sind die Geschwister.", "family"],
  ["das", "Gespräch", "noun", "the conversation", "Das ist das Gespräch.", "other"],
  ["", "gestorben", "adjective", "died / deceased", "Der Fisch ist tot.", "other"],
  ["das", "Getränk", "noun", "the drink / beverage", "Ich möchte ein Getränk.", "food"],
  ["das", "Gewicht", "noun", "the weight", "Das ist das Gewicht.", "other"],
  ["", "gewinnen", "verb", "to win", "Ich möchte gewinnen.", "verb"],
  ["das", "Glas", "noun", "the glass", "Das ist das Glas.", "tableware"],
  ["", "glauben", "verb", "to believe / think", "Ich möchte glauben.", "verb"],
  ["", "gleich", "adverb", "right away / equal", "Ich komme gleich.", "adverb"],
  ["das", "Gleis", "noun", "the train track", "Das ist das Gleis.", "transport"],
  ["das", "Glück", "noun", "the luck / happiness", "Das ist das Glück.", "other"],
  ["", "glücklich", "adjective", "happy", "Ich bin glücklich.", "adjective"],
  ["der", "Glückwunsch", "noun", "the congratulations", "Das ist der Glückwunsch.", "other"],
  ["", "gratulieren", "verb", "to congratulate", "Ich gratuliere dir.", "verb"],
  ["", "grillen", "verb", "to grill / barbecue", "Wir grillen im Garten.", "verb"],
  ["", "groß", "adjective", "big / tall", "Das ist groß.", "adjective"],
  ["die", "Größe", "noun", "the size", "Das ist die Größe.", "other"],
  ["die", "Großeltern", "noun", "the grandparents", "Das sind die Großeltern.", "family"],
  ["die", "Großmutter", "noun", "the grandmother", "Das ist die Großmutter.", "family"],
  ["der", "Großvater", "noun", "the grandfather", "Das ist der Großvater.", "family"],
  ["die", "Gruppe", "noun", "the group", "Das ist die Gruppe.", "other"],
  ["der", "Gruß", "noun", "the greeting", "Das ist der Gruß.", "other"],
  ["", "gültig", "adjective", "valid", "Das ist gültig.", "adjective"],
  ["", "günstig", "adjective", "cheap / favorable", "Das ist günstig.", "adjective"],
  ["", "gut", "adjective", "good", "Das ist gut.", "adjective"],
  ["das", "Haar", "noun", "the hair", "Das ist das Haar.", "body"],
  ["die", "Haare", "noun", "the hair / hairs", "Meine Haare sind lang.", "body"],
  ["", "haben", "verb", "to have", "Ich habe heute Zeit.", "verb"],
  ["das", "Hähnchen", "noun", "the chicken", "Das ist das Hähnchen.", "food"],
  ["die", "Halbpension", "noun", "the half board", "Das ist die Halbpension.", "places"],
  ["die", "Halle", "noun", "the hall", "Das ist die Halle.", "places"],
  ["", "hallo", "phrase", "hello", "Ich sage: „hallo.“", "other"],
  ["", "halten", "verb", "to hold / stop", "Ich möchte halten.", "verb"],
  ["die", "Haltestelle", "noun", "the bus stop", "Das ist die Haltestelle.", "transport"],
  ["die", "Hand", "noun", "the hand", "Ich wasche meine Hand.", "body"],
  ["das", "Handy", "noun", "the mobile phone", "Das ist mein Handy.", "electronics"],
  ["", "hässlich", "adjective", "ugly", "Das Sofa ist hässlich.", "adjective"],
  ["das", "Haus", "noun", "the house", "Das Haus ist groß.", "house"],
  ["die", "Hausaufgabe", "noun", "the homework", "Das ist die Hausaufgabe.", "stationery"],
  ["die", "Hausfrau", "noun", "the housewife", "Das ist die Hausfrau.", "professions"],
  ["der", "Hausmann", "noun", "the househusband", "Das ist der Hausmann.", "professions"],
  ["das", "Heft", "noun", "the notebook", "Das Heft ist auf dem Tisch.", "stationery"],
  ["die", "Heimat", "noun", "the homeland / native country", "Das ist die Heimat.", "places"],
  ["", "heiraten", "verb", "to marry", "Sie heiratet im Mai.", "verb"],
  ["", "heißen", "verb", "to be called", "Ich heiße Anna.", "verb"],
  ["", "heiß", "adjective", "hot", "Der Tee ist heiß.", "adjective"],
  ["", "helfen", "verb", "to help", "Ich helfe meiner Mutter.", "verb"],
  ["das", "Hemd", "noun", "the shirt", "Ich trage ein Hemd.", "clothing"],
  ["der", "Herd", "noun", "the stove", "Das ist der Herd.", "house"],
  ["der", "Herr", "noun", "the gentleman / Mr.", "Das ist der Herr.", "people"],
  ["", "herzlich", "adjective", "warmly / cordial", "Das ist herzlich.", "adjective"],
  ["", "hier", "adverb", "here", "Ich bin hier.", "adverb"],
  ["die", "Hilfe", "noun", "the help", "Das ist die Hilfe.", "other"],
  ["", "hinten", "adverb", "behind / at the back", "Der Bus ist hinten.", "adverb"],
  ["das", "Hobby", "noun", "the hobby", "Das ist das Hobby.", "other"],
  ["", "hoch", "adjective", "high / tall", "Das ist hoch.", "adjective"],
  ["die", "Hochzeit", "noun", "the wedding", "Das ist die Hochzeit.", "other"],
  ["", "holen", "verb", "to get / fetch", "Ich möchte holen.", "verb"],
  ["", "hören", "verb", "to hear / listen", "Ich höre Musik.", "verb"],
  ["die", "Hose", "noun", "the pants / trousers", "Ich trage eine Hose.", "clothing"],
  ["das", "Hotel", "noun", "the hotel", "Das Hotel ist schön.", "places"],
  ["der", "Hund", "noun", "the dog", "Das ist der Hund.", "other"],
  ["der", "Hunger", "noun", "hunger", "Ich habe Hunger.", "food"],
  ["", "ich", "other", "I", "Ich bin heute zu Hause.", "people"],
  ["die", "Idee", "noun", "the idea", "Das ist eine gute Idee.", "other"],
  ["", "ihr", "other", "her / you all / their", "Das ist ihr Hund.", "other"],
  ["", "immer", "adverb", "always", "Ich lerne immer am Abend.", "adverb"],
  ["", "in", "other", "in / inside", "Ich bin in Berlin.", "other"],
  ["die", "Information", "noun", "the information", "Das ist die Information.", "other"],
  ["der", "Ingenieur", "noun", "the engineer", "Der Ingenieur arbeitet hier.", "professions"],
  ["", "international", "adjective", "international", "Die Schule ist international.", "adjective"],
  ["das", "Internet", "noun", "the internet", "Das ist das Internet.", "electronics"],
  ["", "ja", "phrase", "yes", "Ich sage: „ja.“", "other"],
  ["die", "Jacke", "noun", "the jacket", "Ich trage eine Jacke.", "clothing"],
  ["", "jeder", "adjective", "each / every", "Das ist jeder.", "adjective"],
  ["", "jetzt", "adverb", "now", "Jetzt lerne ich Deutsch.", "adverb"],
  ["der", "Job", "noun", "the job", "Das ist der Job.", "professions"],
  ["der", "Jugendliche", "noun", "the teenager / youth", "Das ist der Jugendliche.", "people"],
  ["", "jung", "adjective", "young", "Das ist jung.", "adjective"],
  ["der", "Junge", "noun", "the boy", "Das ist der Junge.", "people"],
  ["der", "Kaffee", "noun", "the coffee", "Ich trinke Kaffee.", "food"],
  ["", "kalt", "adjective", "cold", "Das Wasser ist kalt.", "adjective"],
  ["", "kaputt", "adjective", "broken", "Mein Handy ist kaputt.", "adjective"],
  ["die", "Karte", "noun", "the card / map / ticket", "Das ist die Karte.", "other"],
  ["die", "Kartoffel", "noun", "the potato", "Das ist die Kartoffel.", "food"],
  ["der", "Käse", "noun", "the cheese", "Das ist der Käse.", "food"],
  ["die", "Kasse", "noun", "the cash register / checkout", "Das ist die Kasse.", "places"],
  ["die", "Katze", "noun", "the cat", "Das ist die Katze.", "people"],
  ["", "kaufen", "verb", "to buy", "Ich kaufe Brot.", "verb"],
  ["", "kein", "other", "no / none", "Ich habe kein Auto.", "other"],
  ["der", "Kellner", "noun", "the waiter", "Der Kellner bringt das Essen.", "professions"],
  ["", "kennen", "verb", "to know (a person/place)", "Ich kenne Berlin.", "verb"],
  ["", "kennenlernen", "verb", "to get to know", "Ich möchte kennenlernen.", "verb"],
  ["das", "Kind", "noun", "the child / kid", "Das ist ein Kind.", "people"],
  ["der", "Kindergarten", "noun", "the kindergarten", "Das ist der Kindergarten.", "places"],
  ["das", "Kino", "noun", "the cinema", "Das ist das Kino.", "places"],
  ["der", "Kiosk", "noun", "the kiosk / small shop", "Das ist der Kiosk.", "places"],
  ["", "klar", "adjective", "clear / sure", "Das ist klar.", "adjective"],
  ["die", "Klasse", "noun", "the class / grade", "Das ist die Klasse.", "other"],
  ["die", "Kleidung", "noun", "the clothes / clothing", "Das sind die Kleidung.", "clothing"],
  ["", "klein", "adjective", "small", "Das ist klein.", "adjective"],
  ["", "kochen", "verb", "to cook", "Ich koche heute.", "verb"],
  ["der", "Koffer", "noun", "the suitcase", "Das ist der Koffer.", "transport"],
  ["der", "Kollege", "noun", "the colleague", "Das ist der Kollege.", "professions"],
  ["", "kommen", "verb", "to come", "Ich komme morgen.", "verb"],
  ["", "können", "verb", "can / to be able to", "Ich kann Deutsch sprechen.", "verb"],
  ["das", "Konto", "noun", "the bank account", "Das ist das Konto.", "other"],
  ["der", "Kopf", "noun", "the head", "Mein Kopf tut weh.", "body"],
  ["", "kosten", "verb", "to cost", "Das kostet fünf Euro.", "verb"],
  ["", "krank", "adjective", "sick / ill", "Ich bin krank.", "adjective"],
  ["", "kriegen", "verb", "to get / receive", "Ich möchte kriegen.", "verb"],
  ["die", "Küche", "noun", "the kitchen", "Die Küche ist sauber.", "house"],
  ["der", "Kuchen", "noun", "the cake", "Das ist der Kuchen.", "food"],
  ["der", "Kugelschreiber", "noun", "the ballpoint pen", "Das ist ein Kugelschreiber.", "stationery"],
  ["der", "Kuli", "noun", "the pen", "Das ist ein Kuli.", "stationery"],
  ["der", "Kühlschrank", "noun", "the refrigerator", "Das ist der Kühlschrank.", "electronics"],
  ["", "kulturell", "adjective", "cultural", "Das ist kulturell.", "adjective"],
  ["", "sich kümmern", "verb", "to take care of", "Ich kümmere mich darum.", "verb"],
  ["der", "Kunde", "noun", "the customer", "Der Kunde bezahlt.", "professions"],
  ["der", "Kurs", "noun", "the course / class", "Das ist der Kurs.", "other"],
  ["", "kurz", "adjective", "short / brief", "Das ist kurz.", "adjective"],
  ["", "lachen", "verb", "to laugh", "Wir lachen zusammen.", "verb"],
  ["der", "Laden", "noun", "the shop / store", "Das ist der Laden.", "places"],
  ["die", "Lampe", "noun", "the lamp", "Die Lampe ist hell.", "furniture"],
  ["das", "Land", "noun", "the country / countryside", "Das ist das Land.", "places"],
  ["", "lang", "adjective", "long", "Das ist lang.", "adjective"],
  ["", "lange", "adverb", "for a long time", "Ich mache das lange.", "adverb"],
  ["", "langsam", "adjective", "slow", "Das ist langsam.", "adjective"],
  ["der", "Laptop", "noun", "the laptop", "Das ist mein Laptop.", "electronics"],
  ["", "laufen", "verb", "to walk / run", "Ich laufe im Park.", "verb"],
  ["", "laut", "adjective", "loud", "Die Musik ist laut.", "adjective"],
  ["", "leben", "verb", "to live", "Ich möchte leben.", "verb"],
  ["das", "Leben", "noun", "the life", "Das ist das Leben.", "other"],
  ["die", "Lebensmittel", "noun", "the groceries / food", "Das sind die Lebensmittel.", "food"],
  ["", "ledig", "adjective", "single / unmarried", "Ich bin ledig.", "adjective"],
  ["", "legen", "verb", "to lay / put down", "Ich möchte legen.", "verb"],
  ["der", "Lehrer", "noun", "the teacher", "Der Lehrer erklärt die Aufgabe.", "professions"],
  ["", "leicht", "adjective", "easy / light", "Das ist leicht.", "adjective"],
  ["", "leider", "adverb", "unfortunately", "Ich mache das leider.", "adverb"],
  ["", "leise", "adjective", "quiet", "Bitte sei leise.", "adjective"],
  ["", "lernen", "verb", "to learn", "Ich lerne Deutsch.", "verb"],
  ["", "lesen", "verb", "to read", "Ich lese ein Buch.", "verb"],
  ["", "letzt", "adjective", "last / final", "Das ist letzt.", "adjective"],
  ["die", "Leute", "noun", "the people", "Das sind die Leute.", "people"],
  ["das", "Licht", "noun", "the light", "Das ist das Licht.", "other"],
  ["", "lieb", "adjective", "dear / sweet", "Das ist lieb.", "adjective"],
  ["", "lieben", "verb", "to love", "Ich liebe meine Familie.", "verb"],
  ["", "lieber", "adverb", "rather / preferably", "Ich trinke lieber Tee.", "adverb"],
  ["das", "Lied", "noun", "the song", "Das ist das Lied.", "other"],
  ["", "liegen", "verb", "to lie / be located", "Ich möchte liegen.", "verb"],
  ["", "links", "adverb", "left", "Gehen Sie links.", "places"],
  ["der", "Lkw", "noun", "the truck", "Das ist der Lkw.", "transport"],
  ["der", "Löffel", "noun", "the spoon", "Das ist der Löffel.", "tableware"],
  ["das", "Lokal", "noun", "the pub / restaurant", "Das ist das Lokal.", "places"],
  ["die", "Lösung", "noun", "the solution", "Das ist die Lösung.", "other"],
  ["", "lustig", "adjective", "funny", "Das ist lustig.", "adjective"],
  ["", "machen", "verb", "to make / do", "Ich mache meine Hausaufgaben.", "verb"],
  ["das", "Mädchen", "noun", "the girl", "Das ist das Mädchen.", "people"],
  ["", "man", "other", "one / people (pronoun)", "Man lernt jeden Tag.", "other"],
  ["", "manchmal", "adverb", "sometimes", "Manchmal sehe ich fern.", "adverb"],
  ["der", "Mann", "noun", "the man", "Das ist der Mann.", "people"],
  ["", "männlich", "adjective", "masculine / male", "Die Person ist männlich.", "adjective"],
  ["der", "Markt", "noun", "the market", "Der Markt ist heute offen.", "places"],
  ["die", "Maschine", "noun", "the machine", "Das ist die Maschine.", "electronics"],
  ["das", "Meer", "noun", "the sea", "Das ist das Meer.", "places"],
  ["", "mehr", "adverb", "more", "Ich möchte mehr.", "adverb"],
  ["", "mein", "other", "my", "Das ist mein Buch.", "other"],
  ["", "meist", "adverb", "mostly", "Ich mache das meist.", "adverb"],
  ["der", "Mensch", "noun", "the human / person", "Das ist der Mensch.", "people"],
  ["", "mieten", "verb", "to rent", "Ich möchte eine Wohnung mieten.", "verb"],
  ["die", "Miete", "noun", "the rent", "Das ist die Miete.", "house"],
  ["die", "Milch", "noun", "the milk", "Ich trinke Milch.", "food"],
  ["", "mit", "other", "with", "Ich gehe mit meinem Freund.", "other"],
  ["", "mitbringen", "verb", "to bring along", "Ich möchte mitbringen.", "verb"],
  ["", "mitkommen", "verb", "to come along", "Ich möchte mitkommen.", "verb"],
  ["", "mitmachen", "verb", "to participate / join in", "Ich möchte mitmachen.", "verb"],
  ["", "mitnehmen", "verb", "to take along", "Ich möchte mitnehmen.", "verb"],
  ["die", "Mitte", "noun", "the middle", "Das ist die Mitte.", "places"],
  ["die", "Möbel", "noun", "the furniture", "Das sind die Möbel.", "furniture"],
  ["", "möchten", "verb", "would like to", "Ich möchte einen Kaffee.", "verb"],
  ["", "mögen", "verb", "to like", "Ich mag Musik.", "verb"],
  ["", "möglich", "adjective", "possible", "Das ist möglich.", "adjective"],
  ["der", "Moment", "noun", "the moment", "Warte einen Moment.", "time"],
  ["das", "Motorrad", "noun", "the motorcycle", "Das Motorrad ist schnell.", "transport"],
  ["", "müde", "adjective", "tired", "Ich bin müde.", "adjective"],
  ["der", "Mund", "noun", "the mouth", "Mein Mund ist trocken.", "body"],
  ["", "müssen", "verb", "must / to have to", "Ich muss heute lernen.", "verb"],
  ["die", "Mutter", "noun", "the mother", "Das ist meine Mutter.", "family"],
  ["", "nach", "other", "after / to", "Ich lerne das Wort „nach“.", "other"],
  ["", "nächst", "adjective", "next", "Das ist nächst.", "adjective"],
  ["der", "Name", "noun", "the name", "Mein Name ist Anna.", "other"],
  ["die", "Nase", "noun", "the nose", "Meine Nase ist kalt.", "body"],
  ["", "nehmen", "verb", "to take", "Ich nehme den Bus.", "verb"],
  ["", "nein", "phrase", "no", "Ich sage: „nein.“", "other"],
  ["", "neu", "adjective", "new", "Das ist neu.", "adjective"],
  ["", "nicht", "adverb", "not", "Ich mache das nicht.", "adverb"],
  ["", "nichts", "other", "nothing", "Ich habe nichts.", "other"],
  ["", "nie", "adverb", "never", "Ich trinke nie Alkohol.", "adverb"],
  ["", "noch", "adverb", "still / yet", "Ich bin noch hier.", "adverb"],
  ["", "normal", "adjective", "normal", "Das ist normal.", "adjective"],
  ["die", "Nummer", "noun", "the number", "Das ist die Nummer.", "other"],
  ["", "nur", "adverb", "only", "Ich habe nur zehn Euro.", "adverb"],
  ["", "oben", "adverb", "above / upstairs", "Das Buch liegt oben.", "places"],
  ["das", "Obst", "noun", "the fruit", "Das ist das Obst.", "food"],
  ["", "oder", "other", "or", "Möchtest du Tee oder Kaffee?", "other"],
  ["", "öffnen", "verb", "to open", "Ich öffne die Tür.", "verb"],
  ["", "geöffnet", "adjective", "open", "Das Geschäft ist geöffnet.", "adjective"],
  ["", "oft", "adverb", "often", "Ich lese oft.", "adverb"],
  ["die", "Ohren", "noun", "the ears", "Das sind die Ohren.", "body"],
  ["", "ohne", "other", "without", "Ich trinke Kaffee ohne Zucker.", "other"],
  ["das", "Öl", "noun", "the oil", "Das ist das Öl.", "food"],
  ["die", "Oma", "noun", "the grandma", "Das ist die Oma.", "family"],
  ["der", "Opa", "noun", "the grandpa", "Das ist der Opa.", "family"],
  ["die", "Ordnung", "noun", "the order / tidiness", "Das ist die Ordnung.", "other"],
  ["der", "Ort", "noun", "the place / location", "Das ist der Ort.", "places"],
  ["das", "Papier", "noun", "the paper", "Das ist das Papier.", "stationery"],
  ["die", "Papiere", "noun", "the documents / papers", "Das sind die Papiere.", "stationery"],
  ["der", "Partner", "noun", "the partner (male)", "Das ist der Partner.", "people"],
  ["die", "Partnerin", "noun", "the partner (female)", "Das ist die Partnerin.", "people"],
  ["die", "Party", "noun", "the party", "Das ist die Party.", "other"],
  ["der", "Pass", "noun", "the passport", "Das ist der Pass.", "other"],
  ["die", "Pause", "noun", "the break / pause", "Ich mache eine Pause.", "time"],
  ["der", "Plan", "noun", "the plan", "Das ist der Plan.", "other"],
  ["der", "Platz", "noun", "the place / square / seat", "Das ist der Platz.", "places"],
  ["die", "Polizei", "noun", "the police", "Das ist die Polizei.", "professions"],
  ["die", "Pommes frites", "noun", "the French fries", "Das sind die Pommes frites.", "food"],
  ["die", "Post", "noun", "the post office", "Das ist die Post.", "places"],
  ["die", "Postleitzahl", "noun", "the postal code", "Das ist die Postleitzahl.", "places"],
  ["das", "Praktikum", "noun", "the internship", "Das ist das Praktikum.", "professions"],
  ["die", "Praxis", "noun", "the practice / doctor's office", "Das ist die Praxis.", "places"],
  ["der", "Preis", "noun", "the price", "Das ist der Preis.", "other"],
  ["das", "Problem", "noun", "the problem", "Das ist ein Problem.", "other"],
  ["der", "Prospekt", "noun", "the brochure", "Das ist der Prospekt.", "stationery"],
  ["die", "Prüfung", "noun", "the exam / test", "Das ist die Prüfung.", "stationery"],
  ["der", "Pullover", "noun", "the sweater", "Ich trage einen Pullover.", "clothing"],
  ["", "pünktlich", "adjective", "punctual / on time", "Ich bin pünktlich.", "adjective"],
  ["", "Rad fahren", "verb", "to cycle", "Ich fahre gern Rad.", "verb"],
  ["das", "Radio", "noun", "the radio", "Das Radio ist an.", "electronics"],
  ["", "rauchen", "verb", "to smoke", "Ich möchte rauchen.", "verb"],
  ["der", "Raum", "noun", "the room / space", "Das ist der Raum.", "house"],
  ["die", "Rechnung", "noun", "the bill / invoice", "Das ist die Rechnung.", "other"],
  ["", "rechts", "adverb", "right", "Gehen Sie rechts.", "places"],
  ["", "regnen", "verb", "to rain", "Heute regnet es.", "verb"],
  ["der", "Regen", "noun", "the rain", "Das ist der Regen.", "other"],
  ["der", "Reis", "noun", "the rice", "Das ist der Reis.", "food"],
  ["", "reisen", "verb", "to travel", "Ich reise gern.", "verb"],
  ["die", "Reise", "noun", "the trip / journey", "Das ist die Reise.", "places"],
  ["das", "Reisebüro", "noun", "the travel agency", "Das ist das Reisebüro.", "places"],
  ["der", "Reiseführer", "noun", "the travel guide", "Das ist der Reiseführer.", "stationery"],
  ["", "reparieren", "verb", "to repair", "Ich repariere das Fahrrad.", "verb"],
  ["die", "Reparatur", "noun", "the repair", "Das ist die Reparatur.", "other"],
  ["das", "Restaurant", "noun", "the restaurant", "Das Restaurant ist gut.", "places"],
  ["die", "Rezeption", "noun", "the reception", "Das ist die Rezeption.", "places"],
  ["", "richtig", "adjective", "correct / right", "Das ist richtig.", "adjective"],
  ["", "riechen", "verb", "to smell", "Die Blume riecht gut.", "verb"],
  ["der", "Rock", "noun", "the skirt", "Das ist der Rock.", "clothing"],
  ["", "ruhig", "adjective", "quiet / calm", "Das ist ruhig.", "adjective"],
  ["der", "Saft", "noun", "the juice", "Ich trinke Saft.", "food"],
  ["", "sagen", "verb", "to say", "Ich möchte sagen.", "verb"],
  ["der", "Salat", "noun", "the salad", "Das ist der Salat.", "food"],
  ["das", "Salz", "noun", "the salt", "Ich brauche Salz.", "food"],
  ["", "sanft", "adjective", "soft / gentle", "Das ist sanft.", "adjective"],
  ["der", "Satz", "noun", "the sentence", "Das ist der Satz.", "stationery"],
  ["die", "S-Bahn", "noun", "the suburban train", "Das ist die S-Bahn.", "transport"],
  ["der", "Schalter", "noun", "the counter / switch", "Das ist der Schalter.", "places"],
  ["", "scheinen", "verb", "to shine / appear", "Ich möchte scheinen.", "verb"],
  ["", "schicken", "verb", "to send", "Ich schicke eine E-Mail.", "verb"],
  ["das", "Schiff", "noun", "the ship / boat", "Das ist das Schiff.", "transport"],
  ["das", "Schild", "noun", "the sign", "Das ist das Schild.", "places"],
  ["der", "Schinken", "noun", "the ham", "Das ist der Schinken.", "food"],
  ["", "schlafen", "verb", "to sleep", "Ich schlafe acht Stunden.", "verb"],
  ["", "schlecht", "adjective", "bad", "Das ist schlecht.", "adjective"],
  ["", "schließen", "verb", "to close / shut", "Ich schließe das Fenster.", "verb"],
  ["", "geschlossen", "adjective", "closed", "Das Geschäft ist geschlossen.", "adjective"],
  ["der", "Schluss", "noun", "the conclusion / end", "Das ist der Schluss.", "other"],
  ["der", "Schlüssel", "noun", "the key", "Das ist der Schlüssel.", "house"],
  ["", "schmecken", "verb", "to taste", "Die Suppe schmeckt gut.", "verb"],
  ["", "schneiden", "verb", "to cut", "Ich schneide das Brot.", "verb"],
  ["", "schnell", "adjective", "fast / quick", "Das ist schnell.", "adjective"],
  ["die", "Schokolade", "noun", "the chocolate", "Ich esse Schokolade.", "food"],
  ["", "schon", "adverb", "already", "Ich bin schon fertig.", "adverb"],
  ["", "schön", "adjective", "beautiful", "Das Wetter ist schön.", "adjective"],
  ["der", "Schrank", "noun", "the cupboard / wardrobe", "Das ist der Schrank.", "furniture"],
  ["", "schreiben", "verb", "to write", "Ich schreibe eine Nachricht.", "verb"],
  ["der", "Schuh", "noun", "the shoe", "Das ist der Schuh.", "clothing"],
  ["die", "Schuhe", "noun", "the shoes", "Ich trage meine Schuhe.", "clothing"],
  ["die", "Schule", "noun", "the school", "Die Schule ist hier.", "places"],
  ["der", "Schüler", "noun", "the student / pupil", "Das ist der Schüler.", "people"],
  ["", "schwer", "adjective", "heavy / difficult", "Das ist schwer.", "adjective"],
  ["die", "Schwester", "noun", "the sister", "Das ist meine Schwester.", "family"],
  ["", "schwimmen", "verb", "to swim", "Ich schwimme gern.", "verb"],
  ["das", "Schwimmbad", "noun", "the swimming pool", "Das ist das Schwimmbad.", "places"],
  ["der", "See", "noun", "the lake", "Das ist der See.", "places"],
  ["", "sehen", "verb", "to see", "Ich sehe einen Film.", "verb"],
  ["die", "Sehenswürdigkeit", "noun", "the tourist sight", "Das ist die Sehenswürdigkeit.", "places"],
  ["", "sehr", "adverb", "very", "Ich mache das sehr.", "adverb"],
  ["", "sein", "verb", "to be / his", "Ich bin zu Hause.", "verb"],
  ["", "an sein", "verb", "to be on", "Ich möchte an sein.", "verb"],
  ["", "weg sein", "verb", "to be away", "Ich möchte weg sein.", "verb"],
  ["", "zu sein", "verb", "to be closed", "Ich möchte zu sein.", "verb"],
  ["", "seit", "other", "since / for", "Ich lerne seit einem Jahr Deutsch.", "other"],
  ["", "selbstständig", "adjective", "independent / self-employed", "Sie arbeitet selbstständig.", "adjective"],
  ["", "sich", "other", "oneself", "Er wäscht sich.", "other"],
  ["", "sie", "other", "she / they", "Sie ist meine Schwester.", "people"],
  ["", "Sie", "other", "you (formal)", "Sie sind sehr nett.", "people"],
  ["", "singen", "verb", "to sing", "Ich singe gern.", "verb"],
  ["", "sitzen", "verb", "to sit", "Ich möchte sitzen.", "verb"],
  ["", "so", "adverb", "so / thus", "Ich mache das so.", "adverb"],
  ["die", "Socken", "noun", "the socks", "Ich trage Socken.", "clothing"],
  ["das", "Sofa", "noun", "the sofa", "Das ist ein Sofa.", "furniture"],
  ["", "sofort", "adverb", "immediately", "Ich komme sofort.", "adverb"],
  ["der", "Sohn", "noun", "the son", "Das ist mein Sohn.", "family"],
  ["", "sollen", "verb", "should / ought to", "Ich soll heute lernen.", "verb"],
  ["die", "Sonne", "noun", "the sun", "Das ist die Sonne.", "other"],
  ["", "spät", "adjective", "late", "Das ist spät.", "adjective"],
  ["", "später", "adverb", "later", "Ich komme später.", "adverb"],
  ["die", "Speisekarte", "noun", "the menu", "Das ist die Speisekarte.", "tableware"],
  ["", "spielen", "verb", "to play", "Ich spiele Fußball.", "verb"],
  ["der", "Sport", "noun", "the sport", "Das ist der Sport.", "other"],
  ["die", "Sprache", "noun", "the language", "Das ist die Sprache.", "other"],
  ["", "sprechen", "verb", "to speak", "Ich spreche Deutsch.", "verb"],
  ["die", "Stadt", "noun", "the city / town", "Das ist die Stadt.", "places"],
  ["", "stehen", "verb", "to stand", "Ich möchte stehen.", "verb"],
  ["die", "Stelle", "noun", "the place / job", "Das ist die Stelle.", "places"],
  ["", "stellen", "verb", "to place / put", "Ich möchte stellen.", "verb"],
  ["der", "Stift", "noun", "the pen", "Das ist ein Stift.", "stationery"],
  ["der", "Stock", "noun", "the floor / storey", "Das ist der Stock.", "house"],
  ["die", "Straße", "noun", "the street", "Das ist die Straße.", "places"],
  ["die", "Straßenbahn", "noun", "the tram", "Das ist die Straßenbahn.", "transport"],
  ["der", "Stuhl", "noun", "the chair", "Das ist ein Stuhl.", "furniture"],
  ["", "studieren", "verb", "to study (at university)", "Ich studiere an der Universität.", "verb"],
  ["das", "Studium", "noun", "the studies / university education", "Das ist das Studium.", "professions"],
  ["der", "Student", "noun", "the university student", "Der Student lernt Deutsch.", "people"],
  ["", "suchen", "verb", "to search / look for", "Ich suche meine Schlüssel.", "verb"],
  ["", "tanzen", "verb", "to dance", "Ich tanze gern.", "verb"],
  ["die", "Tasche", "noun", "the bag / pocket", "Das ist die Tasche.", "clothing"],
  ["die", "Tasse", "noun", "the cup / mug", "Das ist die Tasse.", "tableware"],
  ["das", "Taxi", "noun", "the taxi", "Das ist das Taxi.", "transport"],
  ["der", "Tee", "noun", "the tea", "Ich trinke Tee.", "food"],
  ["der", "Teil", "noun", "the part", "Das ist der Teil.", "other"],
  ["", "telefonieren", "verb", "to make a phone call", "Ich telefoniere mit meiner Mutter.", "verb"],
  ["das", "Telefon", "noun", "the telephone", "Das ist das Telefon.", "electronics"],
  ["der", "Teller", "noun", "the plate", "Das ist der Teller.", "tableware"],
  ["der", "Termin", "noun", "the appointment", "Ich habe morgen einen Termin.", "time"],
  ["der", "Test", "noun", "the test", "Das ist der Test.", "stationery"],
  ["", "teuer", "adjective", "expensive", "Das ist teuer.", "adjective"],
  ["der", "Text", "noun", "the text", "Das ist der Text.", "stationery"],
  ["das", "Thema", "noun", "the topic / subject", "Das ist das Thema.", "other"],
  ["das", "Ticket", "noun", "the ticket", "Das ist das Ticket.", "transport"],
  ["der", "Tisch", "noun", "the table", "Das ist ein Tisch.", "furniture"],
  ["der", "Esstisch", "noun", "the dining table", "Das ist der Esstisch.", "furniture"],
  ["die", "Tochter", "noun", "the daughter", "Das ist meine Tochter.", "family"],
  ["die", "Toilette", "noun", "the toilet / restroom", "Das ist die Toilette.", "house"],
  ["die", "Tomate", "noun", "the tomato", "Das ist die Tomate.", "food"],
  ["", "tot", "adjective", "dead", "Das ist tot.", "adjective"],
  ["", "traurig", "adjective", "sad", "Ich bin traurig.", "adjective"],
  ["", "treffen", "verb", "to meet", "Ich treffe meinen Freund.", "verb"],
  ["die", "Treppe", "noun", "the stairs", "Das sind die Treppe.", "house"],
  ["", "trinken", "verb", "to drink", "Ich trinke Wasser.", "verb"],
  ["", "tschüss", "phrase", "bye / goodbye", "Ich sage: „tschüss.“", "other"],
  ["", "tun", "verb", "to do", "Ich möchte tun.", "verb"],
  ["die", "Tür", "noun", "the door", "Die Tür ist offen.", "house"],
  ["", "über", "other", "over / above / about", "Das Bild hängt über dem Sofa.", "other"],
  ["", "übernachten", "verb", "to stay overnight", "Ich möchte übernachten.", "verb"],
  ["", "überweisen", "verb", "to transfer (money)", "Ich überweise das Geld.", "verb"],
  ["die", "Uhr", "noun", "the clock / watch", "Das ist die Uhr.", "electronics"],
  ["", "um", "other", "around / at", "Wir treffen uns um acht Uhr.", "other"],
  ["", "umziehen", "verb", "to change clothes / move house", "Ich möchte umziehen.", "verb"],
  ["", "und", "other", "and", "Ich trinke Tee und Wasser.", "other"],
  ["", "unser", "other", "our", "Das ist unser Haus.", "other"],
  ["", "unten", "adverb", "below / downstairs", "Die Tasche ist unten.", "places"],
  ["", "unter", "other", "under / below", "Die Tasche ist unter dem Tisch.", "other"],
  ["", "unterrichten", "verb", "to teach", "Sie unterrichtet Deutsch.", "verb"],
  ["der", "Unterricht", "noun", "the class / lesson", "Das ist der Unterricht.", "other"],
  ["", "unterschreiben", "verb", "to sign", "Ich unterschreibe hier.", "verb"],
  ["die", "Unterschrift", "noun", "the signature", "Das ist die Unterschrift.", "other"],
  ["der", "Urlaub", "noun", "the vacation / holiday", "Ich bin im Urlaub.", "calendar"],
  ["der", "Vater", "noun", "the father", "Das ist mein Vater.", "family"],
  ["", "verboten", "adjective", "forbidden / prohibited", "Rauchen ist hier verboten.", "adjective"],
  ["", "verdienen", "verb", "to earn / deserve", "Ich möchte mehr verdienen.", "verb"],
  ["der", "Verein", "noun", "the club / association", "Das ist der Verein.", "other"],
  ["", "vergessen", "verb", "to forget", "Ich vergesse den Schlüssel.", "verb"],
  ["", "verheiratet", "adjective", "married", "Meine Eltern sind verheiratet.", "adjective"],
  ["", "verkaufen", "verb", "to sell", "Wir verkaufen das Auto.", "verb"],
  ["der", "Verkäufer", "noun", "the salesman / seller", "Das ist der Verkäufer.", "professions"],
  ["", "vermieten", "verb", "to rent out", "Wir vermieten die Wohnung.", "verb"],
  ["der", "Vermieter", "noun", "the landlord", "Das ist der Vermieter.", "people"],
  ["", "verstehen", "verb", "to understand", "Ich verstehe die Frage.", "verb"],
  ["", "versuchen", "verb", "to try / attempt", "Ich versuche es noch einmal.", "verb"],
  ["die", "Verwandten", "noun", "the relatives", "Das sind die Verwandten.", "family"],
  ["die", "Verwandte", "noun", "the relative", "Das ist die Verwandte.", "family"],
  ["", "viel", "adverb", "much / a lot", "Ich lerne viel.", "adverb"],
  ["", "vielleicht", "adverb", "maybe / perhaps", "Vielleicht komme ich morgen.", "adverb"],
  ["", "von", "other", "from / of", "Das Geschenk ist von meiner Mutter.", "other"],
  ["", "vor", "other", "before / in front of", "Das Auto steht vor dem Haus.", "other"],
  ["der", "Vorname", "noun", "the first name", "Das ist der Vorname.", "other"],
  ["die", "Vorsicht", "noun", "caution / care", "Das ist die Vorsicht.", "other"],
  ["", "sich vorstellen", "verb", "to introduce oneself / imagine", "Ich stelle mich vor.", "verb"],
  ["die", "Vorwahl", "noun", "the area code", "Das ist die Vorwahl.", "other"],
  ["", "wandern", "verb", "to hike", "Ich möchte wandern.", "verb"],
  ["", "wann", "adverb", "when", "Wann kommst du?", "adverb"],
  ["", "warten", "verb", "to wait", "Ich warte auf den Bus.", "verb"],
  ["", "warum", "adverb", "why", "Warum lernst du Deutsch?", "adverb"],
  ["", "was", "other", "what", "Was machst du?", "other"],
  ["", "was für ein", "phrase", "what kind of", "Ich sage: „was für ein.“", "other"],
  ["", "waschen", "verb", "to wash", "Ich wasche mein Hemd.", "verb"],
  ["die", "Waschmaschine", "noun", "the washing machine", "Das ist die Waschmaschine.", "electronics"],
  ["das", "Wasser", "noun", "the water", "Ich trinke Wasser.", "food"],
  ["", "weh tun", "verb", "to hurt", "Mein Kopf tut weh.", "verb"],
  ["", "weiblich", "adjective", "female / feminine", "Die Person ist weiblich.", "adjective"],
  ["der", "Wein", "noun", "the wine", "Sie trinkt Wein.", "food"],
  ["", "weit", "adjective", "far", "Das ist weit.", "adjective"],
  ["", "weiter", "adverb", "further / continue", "Bitte gehen Sie weiter.", "adverb"],
  ["", "welch", "other", "which", "Welches Buch möchtest du?", "other"],
  ["die", "Welt", "noun", "the world", "Das ist die Welt.", "places"],
  ["", "wenig", "adjective", "little / few", "Das ist wenig.", "adjective"],
  ["", "wer", "other", "who", "Wer ist das?", "people"],
  ["", "werden", "verb", "to become / will", "Ich werde morgen arbeiten.", "verb"],
  ["das", "Wetter", "noun", "the weather", "Das ist das Wetter.", "other"],
  ["", "wichtig", "adjective", "important", "Das ist wichtig.", "adjective"],
  ["", "wie", "adverb", "how", "Wie geht es dir?", "adverb"],
  ["", "wiederholen", "verb", "to repeat", "Ich möchte wiederholen.", "verb"],
  ["das", "Wiederhören", "noun", "hearing again (phone goodbye)", "Das ist das Wiederhören.", "other"],
  ["das", "Wiedersehen", "noun", "seeing again (goodbye)", "Das ist das Wiedersehen.", "other"],
  ["", "wie viel", "phrase", "how much", "Ich sage: „wie viel.“", "other"],
  ["", "willkommen", "phrase", "welcome", "Ich sage: „willkommen.“", "other"],
  ["der", "Wind", "noun", "the wind", "Das ist der Wind.", "other"],
  ["", "wir", "other", "we", "Wir lernen Deutsch.", "people"],
  ["", "wissen", "verb", "to know (facts)", "Ich weiß die Antwort.", "verb"],
  ["", "wo", "adverb", "where", "Wo bist du?", "places"],
  ["", "woher", "adverb", "where from", "Woher kommst du?", "places"],
  ["", "wohin", "adverb", "where to", "Wohin gehst du?", "places"],
  ["", "wohnen", "verb", "to live / reside", "Ich möchte wohnen.", "verb"],
  ["die", "Wohnung", "noun", "the apartment / flat", "Das ist die Wohnung.", "house"],
  ["das", "Wohnzimmer", "noun", "the living room", "Das Wohnzimmer ist hell.", "house"],
  ["das", "Schlafzimmer", "noun", "the bedroom", "Das Schlafzimmer ist ruhig.", "house"],
  ["das", "Badezimmer", "noun", "the bathroom", "Das Badezimmer ist sauber.", "house"],
  ["", "wollen", "verb", "to want", "Ich will Deutsch lernen.", "verb"],
  ["das", "Wort", "noun", "the word", "Das ist das Wort.", "stationery"],
  ["", "wunderbar", "adjective", "wonderful", "Das ist wunderbar.", "adjective"],
  ["", "zahlen", "verb", "to pay", "Ich möchte zahlen.", "verb"],
  ["die", "Zähne", "noun", "the teeth", "Ich putze meine Zähne.", "body"],
  ["", "ziehen", "verb", "to draw / pull", "Ich ziehe die Jacke an.", "verb"],
  ["die", "Zeit", "noun", "the time", "Ich habe heute Zeit.", "time"],
  ["", "zurzeit", "adverb", "currently / at present", "Ich arbeite zurzeit.", "adverb"],
  ["die", "Zeitung", "noun", "the newspaper", "Das ist die Zeitung.", "stationery"],
  ["die", "Zigarette", "noun", "the cigarette", "Das ist die Zigarette.", "other"],
  ["das", "Zimmer", "noun", "the room", "Das ist das Zimmer.", "house"],
  ["der", "Zoll", "noun", "customs office", "Das ist der Zoll.", "places"],
  ["", "zu", "other", "to / closed / too", "Ich gehe zu meiner Freundin.", "other"],
  ["der", "Zucker", "noun", "the sugar", "Ich brauche Zucker.", "food"],
  ["", "zufrieden", "adjective", "satisfied / content", "Das ist zufrieden.", "adjective"],
  ["der", "Zug", "noun", "the train", "Der Zug kommt.", "transport"],
  ["", "zurück", "adverb", "back / return", "Ich komme zurück.", "adverb"],
  ["", "zusammen", "adverb", "together", "Wir lernen zusammen.", "adverb"],
  ["", "zwischen", "other", "between", "Der Stuhl steht zwischen dem Tisch und dem Sofa.", "other"],
  ["", "abbiegen", "verb", "to turn (direction)", "Ich möchte abbiegen.", "transport"],
  ["die", "Abbildung", "noun", "illustration / figure", "Das ist die Abbildung.", "other"],
  ["das", "Abenteuer", "noun", "adventure", "Das ist das Abenteuer.", "places"],
  ["", "aber", "adverb", "but / however", "Ich mache das aber.", "other"],
  ["", "abfahren", "verb", "to depart / leave", "Der Zug fährt um acht Uhr ab.", "transport"],
  ["die", "Abfahrt", "noun", "departure", "Das ist die Abfahrt.", "transport"],
  ["der", "Abfall", "noun", "waste / rubbish", "Das ist der Abfall.", "house"],
  ["der", "Abfalleimer", "noun", "rubbish bin / waste bin", "Das ist der Abfalleimer.", "house"],
  ["die", "Abgase", "noun", "exhaust fumes", "Das sind die Abgase.", "other"],
  ["", "abgeben", "verb", "to hand over / submit", "Ich möchte abgeben.", "verb"],
  ["", "abhängen", "verb", "to depend on", "Ich möchte abhängen.", "verb"],
  ["", "abhängig", "adjective", "dependent", "Das ist abhängig.", "adjective"],
  ["", "abheben", "verb", "to withdraw (money)", "Ich hebe Geld ab.", "verb"],
  ["", "abschreiben", "verb", "to copy / cheat (in test)", "Ich schreibe die Antwort nicht ab.", "verb"],
  ["das", "Abitur", "noun", "high school diploma", "Das ist das Abitur.", "professions"],
  ["", "ablehnen", "verb", "to decline / reject", "Ich lehne das Angebot ab.", "verb"],
  ["", "abmachen", "verb", "to arrange / agree on", "Wir machen einen Termin ab.", "verb"],
  ["", "abnehmen", "verb", "to lose weight / decrease", "Ich möchte abnehmen.", "body"],
  ["", "abonnieren", "verb", "to subscribe", "Ich abonniere die Zeitung.", "verb"],
  ["das", "Abonnement", "noun", "subscription", "Das ist das Abonnement.", "other"],
  ["", "absagen", "verb", "to cancel", "Ich sage den Termin ab.", "verb"],
  ["der", "Abschluss", "noun", "degree / graduation", "Das ist der Abschluss.", "professions"],
  ["der", "Abschnitt", "noun", "section / paragraph", "Das ist der Abschnitt.", "stationery"],
  ["der", "Absender", "noun", "sender", "Das ist der Absender.", "other"],
  ["die", "Absicht", "noun", "intention / purpose", "Das ist die Absicht.", "other"],
  ["", "absolut", "adjective", "absolute / complete", "Das ist absolut.", "adjective"],
  ["", "abstimmen", "verb", "to vote / coordinate", "Ich möchte abstimmen.", "verb"],
  ["die", "Abteilung", "noun", "department", "Das ist die Abteilung.", "professions"],
  ["der", "Abwart", "noun", "caretaker / janitor", "Das ist der Abwart.", "professions"],
  ["", "abwärts", "adverb", "downwards", "Ich mache das abwärts.", "adverb"],
  ["", "abwaschen", "verb", "to wash the dishes", "Ich möchte abwaschen.", "verb"],
  ["", "abwesend", "adjective", "absent", "Das ist abwesend.", "adjective"],
  ["", "achten", "verb", "to pay attention / respect", "Ich möchte achten.", "verb"],
  ["", "Achtung", "noun", "attention / caution", "Das ist Achtung.", "other"],
  ["die", "Adresse", "noun", "address", "Hier ist meine Adresse.", "other"],
  ["", "ähnlich", "adjective", "similar", "Das ist ähnlich.", "adjective"],
  ["die", "Ahnung", "noun", "clue / idea", "Das ist die Ahnung.", "other"],
  ["die", "Aktion", "noun", "campaign / action", "Das ist die Aktion.", "other"],
  ["", "aktiv", "adjective", "active", "Das ist aktiv.", "adjective"],
  ["die", "Aktivität", "noun", "activity", "Das ist die Aktivität.", "other"],
  ["", "aktuell", "adjective", "current / up-to-date", "Das ist aktuell.", "adjective"],
  ["", "akzeptieren", "verb", "to accept", "Ich möchte akzeptieren.", "verb"],
  ["der", "Alarm", "noun", "alarm", "Das ist der Alarm.", "other"],
  ["der", "Alkohol", "noun", "alcohol", "Das ist der Alkohol.", "food"],
  ["", "allerdings", "adverb", "however / certainly", "Ich mache das allerdings.", "adverb"],
  ["", "allgemein", "adjective", "general / universal", "Das ist allgemein.", "adjective"],
  ["der", "Alltag", "noun", "everyday life / routine", "Das ist der Alltag.", "other"],
  ["", "alltäglich", "adjective", "daily / routine", "Das ist alltäglich.", "adjective"],
  ["das", "Alphabet", "noun", "alphabet", "Das ist das Alphabet.", "stationery"],
  ["", "als", "other", "than / when / as", "Ich lerne das Wort „als“.", "other"],
  ["das", "Alter", "noun", "age", "Das ist das Alter.", "other"],
  ["das", "Altenheim", "noun", "nursing home", "Das ist das Altenheim.", "house"],
  ["", "alternativ", "adjective", "alternative", "Das ist alternativ.", "adjective"],
  ["die", "Alternative", "noun", "alternative", "Das ist die Alternative.", "other"],
  ["die", "Ampel", "noun", "traffic light", "Das ist die Ampel.", "transport"],
  ["das", "Amt", "noun", "office / authority", "Das ist das Amt.", "places"],
  ["", "sich amüsieren", "verb", "to have fun / enjoy oneself", "Ich möchte sich amüsieren.", "verb"],
  ["", "an", "other", "at / on", "Das Bild hängt an der Wand.", "other"],
  ["", "analysieren", "verb", "to analyze", "Ich möchte analysieren.", "verb"],
  ["der", "Anbieter", "noun", "provider / supplier", "Das ist der Anbieter.", "professions"],
  ["das", "Angebot", "noun", "offer / special deal", "Das ist das Angebot.", "other"],
  ["", "andererseits", "adverb", "on the other hand", "Ich mache das andererseits.", "adverb"],
  ["", "ändern", "verb", "to change / alter", "Ich möchte ändern.", "verb"],
  ["die", "Änderung", "noun", "change / modification", "Das ist die Änderung.", "other"],
  ["", "anders", "adverb", "differently", "Ich mache das anders.", "adverb"],
  ["", "anerkennen", "verb", "to recognize / acknowledge", "Ich möchte anerkennen.", "verb"],
  ["der", "Anfang", "noun", "beginning / start", "Das ist der Anfang.", "other"],
  ["", "angeben", "verb", "to state / declare", "Ich möchte angeben.", "verb"],
  ["die", "Angabe", "noun", "statement / information", "Das ist die Angabe.", "other"],
  ["der", "Angehörige", "noun", "relative / dependent", "Das ist der Angehörige.", "family"],
  ["", "angenehm", "adjective", "pleasant / comfortable", "Das ist angenehm.", "adjective"],
  ["die", "Angst", "noun", "fear / anxiety", "Das ist die Angst.", "other"],
  ["", "ängstlich", "adjective", "fearful / anxious", "Das ist ängstlich.", "adjective"],
  ["", "anhaben", "verb", "to wear / have on", "Ich möchte anhaben.", "verb"],
  ["", "anklicken", "verb", "to click on", "Ich klicke den Link an.", "verb"],
  ["die", "Ankunft", "noun", "arrival", "Das ist die Ankunft.", "transport"],
  ["", "ankündigen", "verb", "to announce", "Ich möchte ankündigen.", "verb"],
  ["die", "Anlage", "noun", "attachment / sound system", "Das ist die Anlage.", "electronics"],
  ["die", "Anleitung", "noun", "instructions / manual", "Das ist die Anleitung.", "stationery"],
  ["", "anmelden", "verb", "to register / sign up", "Ich melde mich an.", "verb"],
  ["die", "Anmeldung", "noun", "registration", "Das ist die Anmeldung.", "places"],
  ["", "annehmen", "verb", "to accept / assume", "Ich möchte annehmen.", "verb"],
  ["die", "Annonce", "noun", "advertisement", "Das ist die Annonce.", "other"],
  ["die", "Anrede", "noun", "salutation", "Das ist die Anrede.", "stationery"],
  ["", "anrufen", "verb", "to call / phone", "Ich rufe meine Mutter an.", "verb"],
  ["der", "Anruf", "noun", "phone call", "Das ist der Anruf.", "other"],
  ["der", "Anrufbeantworter", "noun", "answering machine", "Das ist der Anrufbeantworter.", "electronics"],
  ["die", "Ansage", "noun", "announcement", "Das ist die Ansage.", "other"],
  ["", "anschaffen", "verb", "to purchase / acquire", "Ich möchte anschaffen.", "verb"],
  ["", "anschließen", "verb", "to connect / plug in", "Ich möchte anschließen.", "verb"],
  ["der", "Anschluss", "noun", "connection / transfer", "Das ist der Anschluss.", "transport"],
  ["", "anschnallen", "verb", "to fasten seatbelt", "Ich möchte anschnallen.", "verb"],
  ["", "ansehen", "verb", "to look at / watch", "Ich möchte ansehen.", "verb"],
  ["", "ansprechen", "verb", "to address / speak to", "Ich möchte ansprechen.", "verb"],
  ["der", "Anspruch", "noun", "claim / entitlement", "Das ist der Anspruch.", "other"],
  ["", "anstellen", "verb", "to turn on / hire / queue", "Ich möchte anstellen.", "verb"],
  ["der", "Angestellte", "noun", "employee", "Das ist der Angestellte.", "professions"],
  ["", "anstrengen", "verb", "to exert / strain", "Ich möchte anstrengen.", "verb"],
  ["", "anstrengend", "adjective", "exhausting / demanding", "Das ist anstrengend.", "adjective"],
  ["der", "Antrag", "noun", "application / request", "Das ist der Antrag.", "stationery"],
  ["", "anwenden", "verb", "to apply / use", "Ich möchte anwenden.", "verb"],
  ["", "anwesend", "adjective", "present / attending", "Das ist anwesend.", "adjective"],
  ["die", "Antwort", "noun", "answer / reply", "Das ist die Antwort.", "other"],
  ["der", "Anwalt", "noun", "lawyer / attorney", "Das ist der Anwalt.", "professions"],
  ["", "anzeigen", "verb", "to report / advertise", "Ich möchte anzeigen.", "verb"],
  ["die", "Anzeige", "noun", "advertisement / notice", "Das ist die Anzeige.", "other"],
  ["der", "Anzug", "noun", "suit", "Das ist der Anzug.", "clothing"],
  ["das", "Apartment", "noun", "apartment", "Das ist das Apartment.", "house"],
  ["der", "Apfel", "noun", "apple", "Das ist der Apfel.", "food"],
  ["die", "Apotheke", "noun", "pharmacy", "Das ist die Apotheke.", "places"],
  ["der", "Apparat", "noun", "device / appliance", "Das ist der Apparat.", "electronics"],
  ["der", "Appetit", "noun", "appetite", "Ich habe Appetit.", "food"],
  ["die", "Aprikose", "noun", "apricot", "Das ist die Aprikose.", "food"],
  ["die", "Arbeit", "noun", "work / employment", "Ich habe viel Arbeit.", "professions"],
  ["der", "Arbeiter", "noun", "worker / laborer", "Das ist der Arbeiter.", "professions"],
  ["die", "Arbeitserlaubnis", "noun", "work permit", "Das ist die Arbeitserlaubnis.", "professions"],
  ["die", "Arbeitslosigkeit", "noun", "unemployment", "Das ist die Arbeitslosigkeit.", "other"],
  ["der", "Arbeitsplatz", "noun", "job / workplace", "Das ist der Arbeitsplatz.", "professions"],
  ["die", "Arbeitsstelle", "noun", "position / job", "Das ist die Arbeitsstelle.", "professions"],
  ["der", "Architekt", "noun", "architect", "Das ist der Architekt.", "professions"],
  ["", "sich ärgern", "verb", "to get annoyed", "Ich möchte sich ärgern.", "verb"],
  ["der", "Ärger", "noun", "trouble / anger", "Das ist der Ärger.", "other"],
  ["", "ärgerlich", "adjective", "annoying / vexing", "Das ist ärgerlich.", "adjective"],
  ["der", "Arm", "noun", "arm", "Das ist der Arm.", "body"],
  ["die", "Art", "noun", "type / manner / way", "Das ist die Art.", "other"],
  ["der", "Artikel", "noun", "article / press item", "Das ist der Artikel.", "stationery"],
  ["der", "Arzt", "noun", "doctor / physician", "Der Arzt hilft mir.", "professions"],
  ["das", "Asyl", "noun", "asylum", "Das ist das Asyl.", "other"],
  ["", "atmen", "verb", "to breathe", "Ich möchte atmen.", "body"],
  ["der", "Atem", "noun", "breath", "Das ist der Atem.", "body"],
  ["der", "Aufenthalt", "noun", "stay / layover", "Das ist der Aufenthalt.", "transport"],
  ["", "auffallen", "verb", "to stand out / notice", "Ich möchte auffallen.", "verb"],
  ["", "auffordern", "verb", "to prompt / request", "Ich möchte auffordern.", "verb"],
  ["die", "Aufforderung", "noun", "request / prompt", "Das ist die Aufforderung.", "other"],
  ["", "aufführen", "verb", "to perform / stage", "Ich möchte aufführen.", "verb"],
  ["die", "Aufgabe", "noun", "task / homework", "Das ist die Aufgabe.", "stationery"],
  ["", "aufgeben", "verb", "to give up / post", "Ich möchte aufgeben.", "verb"],
  ["", "aufhalten", "verb", "to hold up / delay", "Ich möchte aufhalten.", "verb"],
  ["", "aufheben", "verb", "to pick up / keep", "Ich möchte aufheben.", "verb"],
  ["", "aufladen", "verb", "to recharge (battery)", "Ich möchte aufladen.", "electronics"],
  ["", "auflösen", "verb", "to dissolve / disperse", "Ich möchte auflösen.", "verb"],
  ["", "aufmerksam", "adjective", "attentive", "Das ist aufmerksam.", "adjective"],
  ["", "aufnehmen", "verb", "to record / admit", "Ich möchte aufnehmen.", "verb"],
  ["die", "Aufnahme", "noun", "recording / admission", "Das ist die Aufnahme.", "electronics"],
  ["", "aufpassen", "verb", "to pay attention / watch", "Ich möchte aufpassen.", "verb"],
  ["", "aufräumen", "verb", "to tidy up / clean", "Ich möchte aufräumen.", "verb"],
  ["", "aufregen", "verb", "to upset / excite", "Ich möchte aufregen.", "verb"],
  ["", "aufstehen", "verb", "to stand up / get up", "Ich stehe früh auf.", "verb"],
  ["der", "Auftrag", "noun", "order / mission", "Das ist der Auftrag.", "professions"],
  ["", "auftreten", "verb", "to perform / occur", "Ich möchte auftreten.", "verb"],
  ["der", "Auftritt", "noun", "performance / gig", "Das ist der Auftritt.", "other"],
  ["", "aufwachen", "verb", "to wake up", "Ich möchte aufwachen.", "verb"],
  ["", "aufwärts", "adverb", "upwards", "Ich mache das aufwärts.", "adverb"],
  ["der", "Aufzug", "noun", "elevator / lift", "Das ist der Aufzug.", "house"],
  ["das", "Auge", "noun", "eye", "Mein Auge tut weh.", "body"],
  ["der", "Augenblick", "noun", "moment", "Das ist der Augenblick.", "time"],
  ["", "aus", "other", "out of / from", "Ich komme aus Indien.", "other"],
  ["die", "Ausbildung", "noun", "training / apprenticeship", "Das ist die Ausbildung.", "professions"],
  ["", "ausgebildet", "adjective", "trained / qualified", "Das ist ausgebildet.", "adjective"],
  ["", "ausdrucken", "verb", "to print out", "Ich möchte ausdrucken.", "verb"],
  ["der", "Ausdruck", "noun", "expression / printout", "Das ist der Ausdruck.", "stationery"],
  ["", "auseinander", "adverb", "apart", "Ich mache das auseinander.", "adverb"],
  ["die", "Ausfahrt", "noun", "exit (motorway)", "Das ist die Ausfahrt.", "transport"],
  ["", "ausfallen", "verb", "to be cancelled / fail", "Ich möchte ausfallen.", "verb"],
  ["der", "Ausflug", "noun", "excursion / outing", "Das ist der Ausflug.", "places"],
  ["die", "Ausgabe", "noun", "expenditure / issue", "Das ist die Ausgabe.", "other"],
  ["der", "Ausgang", "noun", "exit", "Das ist der Ausgang.", "places"],
  ["", "ausgeben", "verb", "to spend (money)", "Ich möchte ausgeben.", "verb"],
  ["", "ausgehen", "verb", "to go out / turn off", "Ich möchte ausgehen.", "verb"],
  ["", "ausgezeichnet", "adjective", "excellent", "Das ist ausgezeichnet.", "adjective"],
  ["die", "Aushilfe", "noun", "temporary assistant", "Das ist die Aushilfe.", "professions"],
  ["die", "Auskunft", "noun", "information", "Das ist die Auskunft.", "other"],
  ["das", "Ausland", "noun", "abroad", "Das ist das Ausland.", "places"],
  ["der", "Ausländer", "noun", "foreigner", "Das ist der Ausländer.", "people"],
  ["", "ausmachen", "verb", "to turn off / agree on", "Ich mache das Licht aus.", "verb"],
  ["die", "Ausnahme", "noun", "exception", "Das ist die Ausnahme.", "other"],
  ["", "ausreichen", "verb", "to be sufficient", "Ich möchte ausreichen.", "verb"],
  ["", "ausrichten", "verb", "to deliver a message", "Ich möchte ausrichten.", "verb"],
  ["", "ausruhen", "verb", "to rest / relax", "Ich möchte ausruhen.", "verb"],
  ["", "außen", "adverb", "outside / on the outside", "Ich mache das außen.", "adverb"],
  ["", "außerhalb", "adverb", "outside of", "Ich mache das außerhalb.", "adverb"],
  ["", "außer", "other", "except for", "Alle kommen außer Peter.", "other"],
  ["", "außerdem", "adverb", "besides / furthermore", "Ich lerne Deutsch und außerdem Englisch.", "adverb"],
  ["die", "Aussicht", "noun", "view / outlook", "Das ist die Aussicht.", "places"],
  ["", "aussprechen", "verb", "to pronounce", "Ich möchte aussprechen.", "verb"],
  ["die", "Aussprache", "noun", "pronunciation", "Das ist die Aussprache.", "stationery"],
  ["", "ausstellen", "verb", "to exhibit / issue", "Ich möchte ausstellen.", "verb"],
  ["die", "Ausstellung", "noun", "exhibition", "Das ist die Ausstellung.", "places"],
  ["", "aussuchen", "verb", "to pick / choose", "Ich möchte aussuchen.", "verb"],
  ["", "auswählen", "verb", "to select", "Ich möchte auswählen.", "verb"],
  ["die", "Auswahl", "noun", "selection / choice", "Das ist die Auswahl.", "other"],
  ["der", "Ausweis", "noun", "identification card", "Das ist der Ausweis.", "other"],
  ["", "ausziehen", "verb", "to undress / move out", "Ich ziehe meine Schuhe aus.", "verb"],
  ["das", "Auto", "noun", "car", "Das ist mein Auto.", "transport"],
  ["die", "Autobahn", "noun", "highway / motorway", "Das ist die Autobahn.", "transport"],
  ["der", "Automat", "noun", "vending machine", "Das ist der Automat.", "electronics"],
  ["", "automatisch", "adjective", "automatic", "Das ist automatisch.", "adjective"],
  ["der", "Autor", "noun", "author", "Das ist der Autor.", "professions"],
  ["", "backen", "verb", "to bake", "Ich möchte backen.", "verb"],
  ["die", "Bäckerei", "noun", "bakery", "Das ist die Bäckerei.", "places"],
  ["das", "Bad", "noun", "bath / bathroom", "Das ist das Bad.", "house"],
  ["die", "Badewanne", "noun", "bathtub", "Das ist die Badewanne.", "house"],
  ["die", "Bahn", "noun", "train / railway", "Das ist die Bahn.", "transport"],
  ["die", "S-Bahn", "noun", "suburban railway", "Das ist die S-Bahn.", "transport"],
  ["die", "Straßenbahn", "noun", "tram", "Das ist die Straßenbahn.", "transport"],
  ["die", "U-Bahn", "noun", "subway / metro", "Das ist die U-Bahn.", "transport"],
  ["der", "Bahnhof", "noun", "train station", "Der Bahnhof ist groß.", "transport"],
  ["der", "Bahnsteig", "noun", "train platform", "Das ist der Bahnsteig.", "transport"],
  ["der", "Balkon", "noun", "balcony", "Das ist der Balkon.", "house"],
  ["der", "Ball", "noun", "ball", "Das ist der Ball.", "other"],
  ["das", "Ballett", "noun", "ballet", "Das ist das Ballett.", "other"],
  ["die", "Banane", "noun", "banana", "Das ist die Banane.", "food"],
  ["die", "Bank", "noun", "bank / bench", "Das ist die Bank.", "places"],
  ["der", "Bankomat", "noun", "ATM / cash machine", "Das ist der Bankomat.", "electronics"],
  ["die", "Bankleitzahl", "noun", "bank routing code", "Das ist die Bankleitzahl.", "other"],
  ["die", "Bankomat-Karte", "noun", "debit card", "Das ist die Bankomat-Karte.", "other"],
  ["die", "Bar", "noun", "bar", "Das ist die Bar.", "places"],
  ["", "bar", "adjective", "in cash", "Ich bezahle bar.", "adjective"],
  ["das", "Bargeld", "noun", "cash money", "Das ist das Bargeld.", "other"],
  ["der", "Bart", "noun", "beard", "Das ist der Bart.", "body"],
  ["der", "Basketball", "noun", "basketball", "Das ist der Basketball.", "other"],
  ["", "basteln", "verb", "to do handicrafts / craft", "Ich möchte basteln.", "verb"],
  ["die", "Batterie", "noun", "battery", "Das ist die Batterie.", "electronics"],
  ["der", "Bauch", "noun", "belly / abdomen", "Das ist der Bauch.", "body"],
  ["", "bauen", "verb", "to build / construct", "Ich möchte bauen.", "verb"],
  ["der", "Bau", "noun", "building / construction", "Das ist der Bau.", "house"],
  ["die", "Baustelle", "noun", "construction site", "Das ist die Baustelle.", "transport"],
  ["der", "Bauer", "noun", "farmer", "Das ist der Bauer.", "professions"],
  ["der", "Baum", "noun", "tree", "Das ist der Baum.", "other"],
  ["", "beachten", "verb", "to pay attention / heed", "Ich möchte beachten.", "verb"],
  ["der", "Beamte", "noun", "civil servant / official", "Das ist der Beamte.", "professions"],
  ["", "beantragen", "verb", "to apply for", "Ich möchte beantragen.", "verb"],
  ["", "beantworten", "verb", "to answer / reply to", "Ich möchte beantworten.", "verb"],
  ["", "sich bedanken", "verb", "to thank", "Ich möchte sich bedanken.", "verb"],
  ["der", "Bedarf", "noun", "need / requirement", "Das ist der Bedarf.", "other"],
  ["die", "Bedeutung", "noun", "meaning / significance", "Das ist die Bedeutung.", "stationery"],
  ["", "bedienen", "verb", "to serve / operate", "Ich möchte bedienen.", "verb"],
  ["die", "Bedienungsanleitung", "noun", "user manual", "Das ist die Bedienungsanleitung.", "stationery"],
  ["die", "Bedingung", "noun", "condition / terms", "Das ist die Bedingung.", "other"],
  ["", "sich beeilen", "verb", "to hurry up", "Ich möchte sich beeilen.", "verb"],
  ["", "beenden", "verb", "to finish / complete", "Ich möchte beenden.", "verb"],
  ["", "sich befinden", "verb", "to be located", "Ich möchte sich befinden.", "verb"],
  ["", "befreit", "adjective", "exempt / freed", "Das ist befreit.", "adjective"],
  ["", "befriedigend", "adjective", "satisfactory", "Das ist befriedigend.", "adjective"],
  ["", "begegnen", "verb", "to meet / encounter", "Ich möchte begegnen.", "verb"],
  ["", "begeistert", "adjective", "enthusiastic / thrilled", "Das ist begeistert.", "adjective"],
  ["der", "Beginn", "noun", "beginning / start", "Das ist der Beginn.", "other"],
  ["", "begleiten", "verb", "to accompany", "Ich möchte begleiten.", "verb"],
  ["", "begrenzt", "adjective", "limited / restricted", "Das ist begrenzt.", "adjective"],
  ["", "begründen", "verb", "to justify / explain reason", "Ich möchte begründen.", "verb"],
  ["die", "Begründung", "noun", "justification / reason", "Das ist die Begründung.", "other"],
  ["", "begrüßen", "verb", "to greet / welcome", "Ich möchte begrüßen.", "verb"],
  ["", "behalten", "verb", "to keep / retain", "Ich möchte behalten.", "verb"],
  ["", "behandeln", "verb", "to treat (medical) / handle", "Ich möchte behandeln.", "verb"],
  ["", "behaupten", "verb", "to claim / assert", "Ich möchte behaupten.", "verb"],
  ["", "behindern", "verb", "to obstruct / hinder", "Ich möchte behindern.", "verb"],
  ["", "behindert", "adjective", "disabled / handicapped", "Das ist behindert.", "body"],
  ["die", "Behörde", "noun", "authority / government agency", "Das ist die Behörde.", "places"],
  ["das", "Bein", "noun", "leg", "Das ist das Bein.", "body"],
  ["", "beinahe", "adverb", "almost / nearly", "Ich mache das beinahe.", "adverb"],
  ["das", "Beispiel", "noun", "example", "Das ist das Beispiel.", "stationery"],
  ["", "beißen", "verb", "to bite", "Ich möchte beißen.", "verb"],
  ["der", "Beitrag", "noun", "contribution / membership fee", "Das ist der Beitrag.", "other"],
  ["der", "Bekannte", "noun", "acquaintance", "Das ist der Bekannte.", "people"],
  ["", "bekannt geben", "verb", "to announce publicly", "Ich möchte bekannt geben.", "verb"],
  ["der", "Beleg", "noun", "receipt / voucher", "Das ist der Beleg.", "other"],
  ["", "beleidigen", "verb", "to offend / insult", "Ich möchte beleidigen.", "verb"],
  ["", "beliebt", "adjective", "popular", "Das ist beliebt.", "adjective"],
  ["", "bemerken", "verb", "to notice", "Ich möchte bemerken.", "verb"],
  ["", "sich bemühen", "verb", "to make an effort", "Ich möchte sich bemühen.", "verb"],
  ["", "benötigen", "verb", "to require / need", "Ich möchte benötigen.", "verb"],
  ["das", "Benzin", "noun", "petrol / gasoline", "Das ist das Benzin.", "transport"],
  ["", "beobachten", "verb", "to observe / watch", "Ich möchte beobachten.", "verb"],
  ["", "bequem", "adjective", "comfortable", "Das ist bequem.", "adjective"],
  ["", "beraten", "verb", "to advise", "Ich möchte beraten.", "verb"],
  ["die", "Beratung", "noun", "consultation / advice", "Das ist die Beratung.", "other"],
  ["", "berechnen", "verb", "to calculate", "Ich möchte berechnen.", "verb"],
  ["der", "Bereich", "noun", "area / field", "Das ist der Bereich.", "other"],
  ["", "bereit", "adjective", "ready / willing", "Das ist bereit.", "adjective"],
  ["", "bereits", "adverb", "already", "Ich mache das bereits.", "adverb"],
  ["der", "Berg", "noun", "mountain", "Das ist der Berg.", "places"],
  ["", "berichten", "verb", "to report", "Ich möchte berichten.", "verb"],
  ["der", "Bericht", "noun", "report / article", "Das ist der Bericht.", "stationery"],
  ["der", "Beruf", "noun", "profession / career", "Das ist der Beruf.", "professions"],
  ["", "beruflich", "adjective", "professionally", "Das ist beruflich.", "adjective"],
  ["", "berufstätig", "adjective", "employed / working", "Das ist berufstätig.", "adjective"],
  ["", "beruhigen", "verb", "to calm down / reassure", "Ich möchte beruhigen.", "verb"],
  ["", "berühmt", "adjective", "famous", "Das ist berühmt.", "adjective"],
  ["", "beschädigen", "verb", "to damage", "Ich möchte beschädigen.", "verb"],
  ["", "beschäftigen", "verb", "to employ / occupy oneself", "Ich möchte beschäftigen.", "verb"],
  ["die", "Beschäftigung", "noun", "occupation / activity", "Das ist die Beschäftigung.", "professions"],
  ["der", "Bescheid", "noun", "decision / notice", "Das ist der Bescheid.", "other"],
  ["", "beschließen", "verb", "to decide / resolve", "Ich möchte beschließen.", "verb"],
  ["", "beschränken", "verb", "to restrict / limit", "Ich möchte beschränken.", "verb"],
  ["", "beschreiben", "verb", "to describe", "Ich möchte beschreiben.", "verb"],
  ["die", "Beschreibung", "noun", "description", "Das ist die Beschreibung.", "stationery"],
  ["", "sich beschweren", "verb", "to complain", "Ich möchte sich beschweren.", "verb"],
  ["", "besetzen", "verb", "to occupy / take a seat", "Ich möchte besetzen.", "verb"],
  ["", "besichtigen", "verb", "to visit / tour (sight)", "Wir besichtigen das Haus.", "verb"],
  ["", "besitzen", "verb", "to own / possess", "Ich möchte besitzen.", "verb"],
  ["", "besonders", "adverb", "especially / particularly", "Das ist besonders schön.", "adverb"],
  ["", "besorgen", "verb", "to obtain / get", "Ich möchte besorgen.", "verb"],
  ["", "besprechen", "verb", "to discuss", "Ich möchte besprechen.", "verb"],
  ["die", "Besprechung", "noun", "meeting / discussion", "Das ist die Besprechung.", "professions"],
  ["die", "Besserung", "noun", "recovery", "Das ist die Besserung.", "other"],
  ["", "bestätigen", "verb", "to confirm", "Ich möchte bestätigen.", "verb"],
  ["die", "Bestätigung", "noun", "confirmation", "Das ist die Bestätigung.", "stationery"],
  ["", "bestehen", "verb", "to pass (exam) / consist of", "Ich möchte bestehen.", "verb"],
  ["", "bestimmt", "adverb", "definitely / certain", "Ich mache das bestimmt.", "adverb"],
  ["", "bestrafen", "verb", "to punish / penalize", "Ich möchte bestrafen.", "verb"],
  ["der", "Besuch", "noun", "visit / guests", "Das ist der Besuch.", "people"],
  ["", "sich beteiligen", "verb", "to participate / chip in", "Ich möchte sich beteiligen.", "verb"],
  ["der", "Betrag", "noun", "amount / sum", "Das ist der Betrag.", "other"],
  ["", "betreuen", "verb", "to look after / supervise", "Ich möchte betreuen.", "verb"],
  ["der", "Betrieb", "noun", "company / operation", "Das ist der Betrieb.", "professions"],
  ["", "betrügen", "verb", "to cheat / deceive", "Ich möchte betrügen.", "verb"],
  ["", "betrunken", "adjective", "drunk / intoxicated", "Das ist betrunken.", "adjective"],
  ["das", "Bett", "noun", "bed", "Das ist ein Bett.", "furniture"],
  ["die", "Bevölkerung", "noun", "population", "Das ist die Bevölkerung.", "other"],
  ["", "bevor", "other", "before", "Ich esse, bevor ich zur Arbeit gehe.", "other"],
  ["", "bewegen", "verb", "to move", "Ich möchte bewegen.", "verb"],
  ["die", "Bewegung", "noun", "movement / exercise", "Das ist die Bewegung.", "body"],
  ["", "beweisen", "verb", "to prove", "Ich möchte beweisen.", "verb"],
  ["der", "Beweis", "noun", "evidence / proof", "Das ist der Beweis.", "other"],
  ["", "sich bewerben", "verb", "to apply (for job)", "Ich möchte sich bewerben.", "verb"],
  ["die", "Bewerbung", "noun", "job application", "Das ist die Bewerbung.", "stationery"],
  ["der", "Bewohner", "noun", "resident / inhabitant", "Das ist der Bewohner.", "people"],
  ["die", "Beziehung", "noun", "relationship", "Das ist die Beziehung.", "family"],
  ["die", "Bibliothek", "noun", "library", "Das ist die Bibliothek.", "places"],
  ["das", "Bier", "noun", "beer", "Er trinkt ein Bier.", "food"],
  ["", "bieten", "verb", "to offer / bid", "Ich möchte bieten.", "verb"],
  ["das", "Bild", "noun", "picture / image", "Das ist das Bild.", "furniture"],
  ["der", "Bildschirm", "noun", "screen / monitor", "Das ist der Bildschirm.", "electronics"],
  ["die", "Biologie", "noun", "biology", "Das ist die Biologie.", "professions"],
  ["die", "Birne", "noun", "pear / lightbulb", "Das ist die Birne.", "food"],
  ["", "bis", "other", "until / up to", "Ich arbeite bis fünf Uhr.", "other"],
  ["", "bisher", "adverb", "until now / so far", "Ich mache das bisher.", "adverb"],
  ["", "ein bisschen", "adverb", "a little bit", "Ich mache das ein bisschen.", "adverb"],
  ["", "bitten", "verb", "to ask / request", "Ich bitte um Hilfe.", "verb"],
  ["die", "Bitte", "noun", "request / favor", "Das ist die Bitte.", "other"],
  ["", "bitte", "phrase", "please / you're welcome", "Ich sage: „bitte.“", "other"],
  ["", "blass", "adjective", "pale", "Das ist blass.", "adjective"],
  ["das", "Blatt", "noun", "leaf / sheet of paper", "Das ist das Blatt.", "stationery"],
  ["der", "Bleistift", "noun", "pencil", "Das ist ein Bleistift.", "stationery"],
  ["der", "Blick", "noun", "glance / view", "Das ist der Blick.", "places"],
  ["", "blind", "adjective", "blind", "Das ist blind.", "body"],
  ["", "blitzen", "verb", "to flash / lightning", "Ich möchte blitzen.", "verb"],
  ["der", "Blitz", "noun", "lightning / camera flash", "Das ist der Blitz.", "electronics"],
  ["", "blond", "adjective", "blonde", "Das ist blond.", "body"],
  ["", "bloß", "adverb", "only / just", "Ich mache das bloß.", "adverb"],
  ["", "blühen", "verb", "to bloom / blossom", "Ich möchte blühen.", "other"],
  ["die", "Blume", "noun", "flower", "Das ist die Blume.", "other"],
  ["die", "Bluse", "noun", "blouse", "Das ist die Bluse.", "clothing"],
  ["", "bluten", "verb", "to bleed", "Ich möchte bluten.", "body"],
  ["das", "Blut", "noun", "blood", "Das ist das Blut.", "body"],
  ["der", "Boden", "noun", "floor / ground / soil", "Das ist der Boden.", "house"],
  ["der", "Bogen", "noun", "sheet (paper) / bow", "Das ist der Bogen.", "stationery"],
  ["die", "Bohne", "noun", "bean", "Das ist die Bohne.", "food"],
  ["das", "Boot", "noun", "boat", "Das ist das Boot.", "transport"],
  ["die", "Botschaft", "noun", "embassy / message", "Das ist die Botschaft.", "places"],
  ["", "böse", "adjective", "angry / evil / bad", "Das ist böse.", "adjective"],
  ["", "braten", "verb", "to roast / fry", "Ich möchte braten.", "verb"],
  ["der", "Braten", "noun", "roast meat", "Das ist der Braten.", "food"],
  ["", "brechen", "verb", "to break", "Ich möchte brechen.", "verb"],
  ["die", "Breite", "noun", "width", "Das ist die Breite.", "other"],
  ["", "bremsen", "verb", "to brake", "Ich möchte bremsen.", "verb"],
  ["die", "Bremse", "noun", "brake", "Das ist die Bremse.", "transport"],
  ["", "brennen", "verb", "to burn", "Ich möchte brennen.", "verb"],
  ["der", "Brief", "noun", "letter", "Das ist der Brief.", "stationery"],
  ["der", "Briefkasten", "noun", "mailbox / postbox", "Das ist der Briefkasten.", "house"],
  ["die", "Briefmarke", "noun", "postage stamp", "Das ist die Briefmarke.", "stationery"],
  ["der", "Briefträger", "noun", "postman / mail carrier", "Das ist der Briefträger.", "professions"],
  ["der", "Briefumschlag", "noun", "envelope", "Das ist der Briefumschlag.", "stationery"],
  ["die", "Brieftasche", "noun", "wallet", "Das ist die Brieftasche.", "other"],
  ["die", "Brille", "noun", "glasses / spectacles", "Das ist die Brille.", "other"],
  ["die", "Broschüre", "noun", "brochure / pamphlet", "Das ist die Broschüre.", "stationery"],
  ["das", "Brot", "noun", "bread", "Das ist das Brot.", "food"],
  ["das", "Brötchen", "noun", "bread roll", "Das ist das Brötchen.", "food"],
  ["die", "Brücke", "noun", "bridge", "Das ist die Brücke.", "places"],
  ["der", "Bruder", "noun", "brother", "Das ist mein Bruder.", "family"],
  ["die", "Brust", "noun", "chest / breast", "Das ist die Brust.", "body"],
  ["das", "Buch", "noun", "book", "Das Buch ist neu.", "stationery"],
  ["die", "Buchhandlung", "noun", "bookstore", "Das ist die Buchhandlung.", "places"],
  ["", "buchen", "verb", "to book / reserve", "Ich möchte buchen.", "verb"],
  ["der", "Buchstabe", "noun", "letter (alphabet)", "Das ist der Buchstabe.", "stationery"],
  ["die", "Bühne", "noun", "stage", "Das ist die Bühne.", "places"],
  ["", "bunt", "adjective", "colorful / multicoloured", "Das ist bunt.", "adjective"],
  ["die", "Burg", "noun", "castle / fortress", "Das ist die Burg.", "places"],
  ["der", "Bürger", "noun", "citizen", "Das ist der Bürger.", "people"],
  ["das", "Büro", "noun", "office", "Das Büro ist oben.", "places"],
  ["die", "Bürste", "noun", "brush", "Das ist die Bürste.", "house"],
  ["der", "Bus", "noun", "bus", "Der Bus kommt.", "transport"],
  ["die", "Butter", "noun", "butter", "Das ist die Butter.", "food"],
  ["das", "Café", "noun", "café", "Das ist das Café.", "places"],
  ["die", "Cafeteria", "noun", "cafeteria", "Das ist die Cafeteria.", "places"],
  ["die", "Chance", "noun", "chance / opportunity", "Das ist die Chance.", "other"],
  ["der", "Chef", "noun", "boss / manager", "Das ist der Chef.", "professions"],
  ["", "schick", "adjective", "chic / smart / stylish", "Das ist schick.", "adjective"],
  ["der", "Coiffeur", "noun", "hairdresser", "Das ist der Coiffeur.", "professions"],
  ["die", "Couch", "noun", "couch / sofa", "Das ist die Couch.", "furniture"],
  ["die", "Creme", "noun", "cream / lotion", "Das ist die Creme.", "other"],
  ["der", "Cousin", "noun", "cousin (male)", "Das ist der Cousin.", "family"],
  ["die", "Cousine", "noun", "cousin (female)", "Das ist die Cousine.", "family"],
  ["das", "Couvert", "noun", "envelope", "Das ist das Couvert.", "stationery"],
  ["", "dabei", "adverb", "there / with it / present", "Ich mache das dabei.", "adverb"],
  ["das", "Dach", "noun", "roof", "Das ist das Dach.", "house"],
  ["", "dafür", "adverb", "for it / in favor", "Ich mache das dafür.", "adverb"],
  ["", "dagegen", "adverb", "against it", "Ich mache das dagegen.", "adverb"],
  ["", "daher", "adverb", "therefore / hence", "Ich mache das daher.", "adverb"],
  ["", "dahin", "adverb", "there / until then", "Ich mache das dahin.", "adverb"],
  ["", "damals", "adverb", "back then / at that time", "Damals war ich klein.", "adverb"],
  ["die", "Dame", "noun", "lady", "Das ist die Dame.", "people"],
  ["", "damit", "other", "so that / with it", "Ich lerne, damit ich Deutsch sprechen kann.", "other"],
  ["", "danach", "adverb", "afterwards / then", "Danach gehe ich nach Hause.", "adverb"],
  ["", "daneben", "adverb", "next to it / beside", "Der Stuhl steht daneben.", "adverb"],
  ["der", "Dank", "noun", "thanks / gratitude", "Das ist der Dank.", "other"],
  ["", "dankbar", "adjective", "grateful / thankful", "Das ist dankbar.", "adjective"],
  ["", "dann", "adverb", "then / after that", "Ich mache das dann.", "adverb"],
  ["", "darstellen", "verb", "to depict / represent", "Ich möchte darstellen.", "verb"],
  ["die", "Darstellung", "noun", "presentation / description", "Das ist die Darstellung.", "stationery"],
  ["", "dass", "other", "that (conjunction)", "Ich weiß, dass du kommst.", "other"],
  ["die", "Datei", "noun", "computer file", "Das ist die Datei.", "electronics"],
  ["das", "Datum", "noun", "date", "Welches Datum ist heute?", "time"],
  ["die", "Daten", "noun", "data / details", "Das ist die Daten.", "electronics"],
  ["die", "Dauer", "noun", "duration", "Das ist die Dauer.", "time"],
  ["", "dauernd", "adjective", "continuous / constant", "Das ist dauernd.", "adjective"],
  ["die", "Decke", "noun", "blanket / ceiling", "Das ist die Decke.", "house"],
  ["", "dekorieren", "verb", "to decorate", "Ich möchte dekorieren.", "verb"],
  ["", "denken", "verb", "to think / reflect", "Ich denke an dich.", "verb"],
  ["der", "Gedanke", "noun", "thought / idea", "Das ist der Gedanke.", "other"],
  ["das", "Denkmal", "noun", "monument / memorial", "Das ist das Denkmal.", "places"],
  ["", "derselbe", "other", "the same", "Ich lerne das Wort „derselbe“.", "other"],
  ["", "deshalb", "adverb", "therefore", "Ich bin krank, deshalb bleibe ich zu Hause.", "adverb"],
  ["das", "Dessert", "noun", "dessert", "Das ist das Dessert.", "food"],
  ["", "deswegen", "adverb", "because of that / therefore", "Ich bin müde, deswegen schlafe ich.", "adverb"],
  ["das", "Detail", "noun", "detail", "Das ist das Detail.", "other"],
  ["", "deutlich", "adjective", "clear / distinct", "Das ist deutlich.", "adjective"],
  ["die", "Diät", "noun", "diet", "Das ist die Diät.", "food"],
  ["der", "Dialekt", "noun", "dialect", "Das ist der Dialekt.", "other"],
  ["der", "Dialog", "noun", "dialogue", "Das ist der Dialog.", "stationery"],
  ["", "dicht", "adjective", "dense / tight / leakproof", "Das ist dicht.", "adjective"],
  ["", "dick", "adjective", "thick / fat", "Das ist dick.", "adjective"],
  ["der", "Dieb", "noun", "thief", "Das ist der Dieb.", "people"],
  ["", "dienen", "verb", "to serve", "Ich möchte dienen.", "verb"],
  ["der", "Dienst", "noun", "service / shift / duty", "Das ist der Dienst.", "professions"],
  ["", "diesmal", "adverb", "this time", "Ich mache das diesmal.", "adverb"],
  ["", "digital", "adjective", "digital", "Das ist digital.", "electronics"],
  ["das", "Ding", "noun", "thing / object", "Das ist das Ding.", "other"],
  ["das", "Diplom", "noun", "diploma / degree", "Das ist das Diplom.", "professions"],
  ["", "direkt", "adjective", "direct / directly", "Das ist direkt.", "adjective"],
  ["der", "Direktor", "noun", "director / principal", "Das ist der Direktor.", "professions"],
  ["die", "Diskothek", "noun", "discotheque / club", "Das ist die Diskothek.", "places"],
  ["", "diskutieren", "verb", "to discuss / debate", "Ich möchte diskutieren.", "verb"],
  ["die", "Diskussion", "noun", "discussion / debate", "Das ist die Diskussion.", "other"],
  ["die", "Distanz", "noun", "distance", "Das ist die Distanz.", "other"],
  ["", "doch", "adverb", "yet / nevertheless / indeed", "Ich mache das doch.", "adverb"],
  ["der", "Doktor", "noun", "doctor / PhD", "Das ist der Doktor.", "professions"],
  ["das", "Dokument", "noun", "document", "Das ist das Dokument.", "stationery"],
  ["", "donnern", "verb", "to thunder", "Ich möchte donnern.", "verb"],
  ["der", "Donner", "noun", "thunder", "Das ist der Donner.", "other"],
  ["", "doppelt", "adjective", "double", "Das ist doppelt.", "adjective"],
  ["das", "Dorf", "noun", "village", "Das ist das Dorf.", "places"],
  ["", "dort", "adverb", "there / over there", "Ich wohne dort.", "adverb"],
  ["", "dorthin", "adverb", "to that place / thither", "Ich mache das dorthin.", "adverb"],
  ["die", "Dose", "noun", "can / tin", "Das ist die Dose.", "tableware"],
  ["der", "Dreck", "noun", "dirt / mud / filth", "Das ist der Dreck.", "house"],
  ["", "drehen", "verb", "to turn / rotate", "Ich möchte drehen.", "verb"],
  ["", "dringend", "adjective", "urgent / pressing", "Das ist dringend.", "adjective"],
  ["", "drinnen", "adverb", "inside / indoors", "Ich bin drinnen.", "adverb"],
  ["die", "Droge", "noun", "drug / narcotic", "Das ist die Droge.", "other"],
  ["die", "Drogerie", "noun", "drugstore / chemist", "Das ist die Drogerie.", "places"],
  ["", "drüben", "adverb", "over there", "Ich mache das drüben.", "adverb"],
  ["der", "Drucker", "noun", "printer", "Das ist der Drucker.", "electronics"],
  ["der", "Druck", "noun", "pressure / print", "Das ist der Druck.", "other"],
  ["", "dumm", "adjective", "stupid / silly", "Das ist dumm.", "adjective"],
  ["", "dünn", "adjective", "thin / slim", "Das ist dünn.", "adjective"],
  ["", "durch", "other", "through / by", "Ich lerne das Wort „durch“.", "other"],
  ["", "durcheinander", "adverb", "confused / in a mess", "Ich mache das durcheinander.", "adverb"],
  ["die", "Durchsage", "noun", "announcement", "Das ist die Durchsage.", "other"],
  ["der", "Durchschnitt", "noun", "average", "Das ist der Durchschnitt.", "other"],
  ["", "durchschnittlich", "adjective", "on average / typical", "Das ist durchschnittlich.", "adjective"],
  ["", "dürfen", "verb", "may / to be permitted", "Darf ich hier sitzen?", "verb"],
  ["der", "Durst", "noun", "thirst", "Ich habe Durst.", "food"],
  ["", "durstig", "adjective", "thirsty", "Das ist durstig.", "adjective"],
  ["die", "Dusche", "noun", "shower", "Das ist die Dusche.", "house"],
  ["", "duzen", "verb", "to address informally (du)", "Ich möchte duzen.", "verb"],
  ["", "eben", "adverb", "just / simply / flat", "Ich mache das eben.", "adverb"],
  ["", "ebenfalls", "adverb", "likewise / also", "Ich mache das ebenfalls.", "adverb"],
  ["", "ebenso", "adverb", "just as / equally", "Ich mache das ebenso.", "adverb"],
  ["", "echt", "adjective", "genuine / real / really", "Das ist echt.", "adjective"],
  ["die", "Ecke", "noun", "corner", "Das ist die Ecke.", "house"],
  ["", "eckig", "adjective", "angular / square", "Das ist eckig.", "adjective"],
  ["", "egal", "adjective", "all the same / indifferent", "Das ist egal.", "adjective"],
  ["die", "Ehe", "noun", "marriage", "Das ist die Ehe.", "family"],
  ["die", "Ehefrau", "noun", "wife", "Das ist die Ehefrau.", "family"],
  ["der", "Ehemann", "noun", "husband", "Das ist der Ehemann.", "family"],
  ["das", "Ehepaar", "noun", "married couple", "Das ist das Ehepaar.", "family"],
  ["", "eher", "adverb", "earlier / rather", "Ich mache das eher.", "adverb"],
  ["", "ehrlich", "adjective", "honest / sincere", "Das ist ehrlich.", "adjective"],
  ["das", "Ei", "noun", "egg", "Das ist das Ei.", "food"],
  ["", "eigen", "adjective", "own / proper", "Das ist eigen.", "adjective"],
  ["", "eigentlich", "adverb", "actually / in fact", "Was willst du eigentlich?", "adverb"],
  ["", "sich eignen", "verb", "to be suitable for", "Ich möchte sich eignen.", "verb"],
  ["", "eilen", "verb", "to hurry / rush", "Ich möchte eilen.", "verb"],
  ["die", "Eile", "noun", "hurry / rush", "Das ist die Eile.", "other"],
  ["", "eilig", "adjective", "urgent / in a rush", "Das ist eilig.", "adjective"],
  ["die", "Einbahnstraße", "noun", "one-way street", "Das ist die Einbahnstraße.", "transport"],
  ["", "einbrechen", "verb", "to break in / burglarize", "Ich möchte einbrechen.", "verb"],
  ["der", "Einbrecher", "noun", "burglar", "Das ist der Einbrecher.", "people"],
  ["der", "Einbruch", "noun", "burglary", "Das ist der Einbruch.", "other"],
  ["", "eindeutig", "adjective", "clear / unambiguous", "Das ist eindeutig.", "adjective"],
  ["der", "Eindruck", "noun", "impression", "Das ist der Eindruck.", "other"],
  ["", "einerseits", "adverb", "on the one hand", "Ich mache das einerseits.", "adverb"],
  ["die", "Einfahrt", "noun", "driveway / entrance gate", "Das ist die Einfahrt.", "transport"],
  ["", "einfallen", "verb", "to occur to / remember", "Ich möchte einfallen.", "verb"],
  ["der", "Einfall", "noun", "idea / inspiration", "Das ist der Einfall.", "other"],
  ["der", "Einfluss", "noun", "influence / impact", "Das ist der Einfluss.", "other"],
  ["", "beeinflussen", "verb", "to influence", "Ich möchte beeinflussen.", "verb"],
  ["", "einfügen", "verb", "to insert / paste", "Ich möchte einfügen.", "verb"],
  ["", "einführen", "verb", "to introduce / import", "Ich möchte einführen.", "verb"],
  ["die", "Einführung", "noun", "introduction", "Das ist die Einführung.", "other"],
  ["der", "Eingang", "noun", "entrance", "Das ist der Eingang.", "places"],
  ["", "einheitlich", "adjective", "uniform / standard", "Das ist einheitlich.", "adjective"],
  ["", "einige", "other", "some / several", "Ich lerne das Wort „einige“.", "other"],
  ["", "sich einigen", "verb", "to agree / reach consensus", "Ich möchte sich einigen.", "verb"],
  ["", "einkaufen", "verb", "to shop / purchase", "Ich kaufe heute ein.", "verb"],
  ["der", "Einkauf", "noun", "purchase / shopping", "Das ist der Einkauf.", "other"],
  ["das", "Einkommen", "noun", "income / salary", "Das ist das Einkommen.", "professions"],
  ["die", "Einladung", "noun", "invitation", "Das ist die Einladung.", "other"],
  ["", "einnehmen", "verb", "to take (medicine) / earn", "Ich möchte einnehmen.", "verb"],
  ["die", "Einnahme", "noun", "revenue / taking (medicine)", "Das ist die Einnahme.", "other"],
  ["", "einpacken", "verb", "to pack / wrap", "Ich möchte einpacken.", "verb"],
  ["", "einrichten", "verb", "to furnish / set up", "Ich möchte einrichten.", "verb"],
  ["die", "Einrichtung", "noun", "furnishing / facility", "Das ist die Einrichtung.", "house"],
  ["", "einsam", "adjective", "lonely / secluded", "Das ist einsam.", "adjective"],
  ["", "einschalten", "verb", "to switch on / turn on", "Ich möchte einschalten.", "verb"],
  ["", "einschließlich", "adverb", "including", "Ich mache das einschließlich.", "adverb"],
  ["das", "Einschreiben", "noun", "registered mail", "Das ist das Einschreiben.", "stationery"],
  ["", "einsetzen", "verb", "to deploy / use / advocate", "Ich möchte einsetzen.", "verb"],
  ["", "einsteigen", "verb", "to board / get in", "Ich steige in den Bus ein.", "verb"],
  ["", "einstellen", "verb", "to hire / adjust", "Ich möchte einstellen.", "verb"],
  ["", "eintragen", "verb", "to register / enter in list", "Ich möchte eintragen.", "verb"],
  ["", "eintreten", "verb", "to enter / join (club)", "Ich möchte eintreten.", "verb"],
  ["der", "Eintritt", "noun", "admission / entry fee", "Das ist der Eintritt.", "places"],
  ["", "einverstanden", "adjective", "agreed / in agreement", "Das ist einverstanden.", "adjective"],
  ["der", "Einwohner", "noun", "inhabitant / resident", "Das ist der Einwohner.", "people"],
  ["", "einzahlen", "verb", "to deposit (money)", "Ich möchte einzahlen.", "verb"],
  ["die", "Einzahlung", "noun", "deposit / payment", "Das ist die Einzahlung.", "other"],
  ["", "einzeln", "adjective", "individual / single", "Das ist einzeln.", "adjective"],
  ["die", "Einzelheit", "noun", "detail", "Das ist die Einzelheit.", "other"],
  ["", "einzig", "adjective", "single / only", "Das ist einzig.", "adjective"],
  ["", "einziehen", "verb", "to move in", "Ich möchte einziehen.", "verb"],
  ["das", "Eis", "noun", "ice / ice cream", "Das ist das Eis.", "food"],
  ["die", "Eisenbahn", "noun", "railway / train", "Das ist die Eisenbahn.", "transport"],
  ["", "elegant", "adjective", "elegant / smart", "Das ist elegant.", "adjective"],
  ["", "elektrisch", "adjective", "electrical", "Das ist elektrisch.", "adjective"],
  ["", "elektronisch", "adjective", "electronic", "Das ist elektronisch.", "adjective"],
  ["die", "Eltern", "noun", "parents", "Das sind die Eltern.", "family"],
  ["", "empfangen", "verb", "to receive / welcome", "Ich möchte empfangen.", "verb"],
  ["der", "Empfänger", "noun", "recipient", "Das ist der Empfänger.", "other"],
  ["die", "Empfehlung", "noun", "recommendation", "Das ist die Empfehlung.", "other"],
  ["", "enden", "verb", "to end / terminate", "Ich möchte enden.", "verb"],
  ["das", "Ende", "noun", "end / conclusion", "Das ist das Ende.", "other"],
  ["", "endgültig", "adjective", "final / definitive", "Das ist endgültig.", "adjective"],
  ["", "endlich", "adverb", "finally / at last", "Endlich bin ich zu Hause.", "adverb"],
  ["die", "Energie", "noun", "energy / power", "Das ist die Energie.", "other"],
  ["", "eng", "adjective", "tight / narrow / close", "Das ist eng.", "adjective"],
  ["der", "Enkel", "noun", "grandchild / grandson", "Das ist der Enkel.", "family"],
  ["", "entdecken", "verb", "to discover / spot", "Ich möchte entdecken.", "verb"],
  ["", "entfernen", "verb", "to remove / distance", "Ich möchte entfernen.", "verb"],
  ["die", "Entfernung", "noun", "distance", "Das ist die Entfernung.", "places"],
  ["", "entgegenkommen", "verb", "to meet halfway / accommodate", "Ich möchte entgegenkommen.", "verb"],
  ["", "enthalten", "verb", "to contain / include", "Ich möchte enthalten.", "verb"],
  ["", "entlang", "other", "along", "Ich lerne das Wort „entlang“.", "other"],
  ["", "entlassen", "verb", "to dismiss / discharge", "Ich möchte entlassen.", "verb"],
  ["die", "Entlassung", "noun", "dismissal / layoff", "Das ist die Entlassung.", "professions"],
  ["", "entscheiden", "verb", "to decide", "Ich möchte entscheiden.", "verb"],
  ["die", "Entscheidung", "noun", "decision", "Das ist die Entscheidung.", "other"],
  ["", "sich entschließen", "verb", "to resolve / make up mind", "Ich möchte sich entschließen.", "verb"],
  ["", "entschuldigung", "noun", "apology / excuse", "Das ist entschuldigung.", "other"],
  ["", "entsorgen", "verb", "to dispose of / recycle", "Ich möchte entsorgen.", "verb"],
  ["", "entspannend", "adjective", "relaxing", "Das ist entspannend.", "adjective"],
  ["", "entstehen", "verb", "to arise / originate", "Ich möchte entstehen.", "verb"],
  ["", "enttäuschen", "verb", "to disappoint", "Ich möchte enttäuschen.", "verb"],
  ["die", "Enttäuschung", "noun", "disappointment", "Das ist die Enttäuschung.", "other"],
  ["", "entweder ... oder", "other", "either ... or", "Ich lerne das Wort „entweder ... oder“.", "other"],
  ["", "entwickeln", "verb", "to develop", "Ich möchte entwickeln.", "verb"],
  ["die", "Entwicklung", "noun", "development / progress", "Das ist die Entwicklung.", "other"],
  ["die", "Erde", "noun", "earth / soil / ground", "Das ist die Erde.", "places"],
  ["das", "Erdgeschoss", "noun", "ground floor", "Das ist das Erdgeschoss.", "house"],
  ["das", "Ereignis", "noun", "event / incident", "Das ist das Ereignis.", "other"],
  ["", "erfahren", "verb", "to experience / find out", "Ich möchte erfahren.", "verb"],
  ["die", "Erfahrung", "noun", "experience", "Das ist die Erfahrung.", "professions"],
  ["", "erfinden", "verb", "to invent", "Ich möchte erfinden.", "verb"],
  ["die", "Erfindung", "noun", "invention", "Das ist die Erfindung.", "other"],
  ["der", "Erfolg", "noun", "success", "Das ist der Erfolg.", "other"],
  ["", "erfolgreich", "adjective", "successful", "Das ist erfolgreich.", "adjective"],
  ["", "erforderlich", "adjective", "required / necessary", "Das ist erforderlich.", "adjective"],
  ["", "erfüllen", "verb", "to fulfill / meet (criteria)", "Ich möchte erfüllen.", "verb"],
  ["", "ergänzen", "verb", "to complete / fill in", "Ich möchte ergänzen.", "verb"],
  ["das", "Ergebnis", "noun", "result / score", "Das ist das Ergebnis.", "other"],
  ["", "erhalten", "verb", "to receive / obtain", "Ich möchte erhalten.", "verb"],
  ["", "erhöhen", "verb", "to raise / increase", "Ich möchte erhöhen.", "verb"],
  ["die", "Erhöhung", "noun", "increase / raise", "Das ist die Erhöhung.", "professions"],
  ["", "sich erholen", "verb", "to recover / recuperate", "Ich möchte sich erholen.", "verb"],
  ["die", "Erholung", "noun", "rest / recreation", "Das ist die Erholung.", "other"],
  ["", "erinnern", "verb", "to remind / remember", "Ich erinnere mich daran.", "verb"],
  ["die", "Erinnerung", "noun", "memory / recollection", "Das ist die Erinnerung.", "other"],
  ["", "sich erkälten", "verb", "to catch a cold", "Ich möchte sich erkälten.", "verb"],
  ["die", "Erkältung", "noun", "common cold", "Das ist die Erkältung.", "body"],
  ["", "erkennen", "verb", "to recognize / realize", "Ich möchte erkennen.", "verb"],
  ["die", "Erklärung", "noun", "explanation", "Das ist die Erklärung.", "stationery"],
  ["", "sich erkundigen", "verb", "to inquire / ask", "Ich möchte sich erkundigen.", "verb"],
  ["", "erlauben", "verb", "to permit / allow", "Ich möchte erlauben.", "verb"],
  ["die", "Erlaubnis", "noun", "permission", "Das ist die Erlaubnis.", "other"],
  ["", "erleben", "verb", "to experience", "Ich möchte erleben.", "verb"],
  ["das", "Erlebnis", "noun", "experience / adventure", "Das ist das Erlebnis.", "other"],
  ["", "erledigen", "verb", "to take care of / settle", "Ich möchte erledigen.", "verb"],
  ["", "erleichtern", "verb", "to facilitate / relieve", "Ich möchte erleichtern.", "verb"],
  ["die", "Ermäßigung", "noun", "discount / reduction", "Das ist die Ermäßigung.", "other"],
  ["", "ernähren", "verb", "to feed / nourish", "Ich möchte ernähren.", "food"],
  ["die", "Ernährung", "noun", "nutrition / diet", "Das ist die Ernährung.", "food"],
  ["", "ernst", "adjective", "serious / grave", "Das ist ernst.", "adjective"],
  ["", "eröffnen", "verb", "to open / inaugurate", "Ich möchte eröffnen.", "verb"],
  ["die", "Eröffnung", "noun", "opening / inauguration", "Das ist die Eröffnung.", "places"],
  ["", "erreichen", "verb", "to reach / achieve", "Ich möchte erreichen.", "verb"],
  ["", "erschöpft", "adjective", "exhausted", "Das ist erschöpft.", "adjective"],
  ["", "erschrecken", "verb", "to startle / frighten", "Ich möchte erschrecken.", "verb"],
  ["", "ersetzen", "verb", "to replace / substitute", "Ich möchte ersetzen.", "verb"],
  ["", "erst", "adverb", "only / first", "Ich mache das erst.", "adverb"],
  ["", "erstellen", "verb", "to compile / generate", "Ich möchte erstellen.", "verb"],
  ["", "erwachsen", "adjective", "adult / grown-up", "Das ist erwachsen.", "adjective"],
  ["der", "Erwachsene", "noun", "adult", "Das ist der Erwachsene.", "people"],
  ["", "erwarten", "verb", "to expect / wait for", "Ich möchte erwarten.", "verb"],
  ["die", "Erzählung", "noun", "story / narrative", "Das ist die Erzählung.", "stationery"],
  ["", "erziehen", "verb", "to bring up / educate", "Ich möchte erziehen.", "verb"],
  ["die", "Erziehung", "noun", "upbringing / education", "Das ist die Erziehung.", "family"],
  ["das", "Essen", "noun", "food / meal", "Das Essen ist gut.", "food"],
  ["der", "Essig", "noun", "vinegar", "Das ist der Essig.", "food"],
  ["", "etwa", "adverb", "about / approximately", "Ich mache das etwa.", "adverb"],
  ["", "etwas", "other", "something / somewhat", "Ich möchte etwas essen.", "other"],
  ["", "eventuell", "adverb", "possibly / perhaps", "Ich mache das eventuell.", "adverb"],
  ["", "ewig", "adjective", "eternal / forever", "Das ist ewig.", "adjective"],
  ["der", "Experte", "noun", "expert / specialist", "Das ist der Experte.", "professions"],
  ["der", "Export", "noun", "export", "Das ist der Export.", "other"],
  ["", "extra", "adverb", "extra / specially", "Ich mache das extra.", "adverb"],
  ["", "extrem", "adjective", "extreme / extremely", "Das ist extrem.", "adjective"],
  ["die", "Fabrik", "noun", "factory / plant", "Das ist die Fabrik.", "places"],
  ["das", "Fach", "noun", "subject / compartment", "Das ist das Fach.", "stationery"],
  ["der", "Fachmann", "noun", "specialist / expert", "Das ist der Fachmann.", "professions"],
  ["die", "Fähigkeit", "noun", "ability / skill", "Das ist die Fähigkeit.", "other"],
  ["", "fahren", "verb", "to drive / ride / travel", "Ich fahre mit dem Bus.", "verb"],
  ["die", "Fähre", "noun", "ferry", "Das ist die Fähre.", "transport"],
  ["die", "Fahrbahn", "noun", "roadway / lane", "Das ist die Fahrbahn.", "transport"],
  ["der", "Fahrer", "noun", "driver", "Das ist der Fahrer.", "professions"],
  ["die", "Fahrkarte", "noun", "ticket (transit)", "Das ist die Fahrkarte.", "transport"],
  ["der", "Fahrplan", "noun", "timetable / schedule", "Das ist der Fahrplan.", "transport"],
  ["das", "Fahrrad", "noun", "bicycle", "Das ist mein Fahrrad.", "transport"],
  ["das", "Fahrzeug", "noun", "vehicle", "Das ist das Fahrzeug.", "transport"],
  ["", "fair", "adjective", "fair / just", "Das ist fair.", "adjective"],
  ["der", "Faktor", "noun", "factor", "Das ist der Faktor.", "other"],
  ["der", "Fall", "noun", "case / instance", "Das ist der Fall.", "other"],
  ["", "fallen", "verb", "to fall / drop", "Ich möchte fallen.", "verb"],
  ["", "fällig", "adjective", "due / payable", "Das ist fällig.", "adjective"],
  ["", "falls", "other", "in case / if", "Ich lerne das Wort „falls“.", "other"],
  ["die", "Familie", "noun", "family", "Meine Familie ist groß.", "family"],
  ["der", "Familienstand", "noun", "marital status", "Das ist der Familienstand.", "family"],
  ["", "fangen", "verb", "to catch / capture", "Ich möchte fangen.", "verb"],
  ["die", "Fantasie", "noun", "imagination / fantasy", "Das ist die Fantasie.", "other"],
  ["", "fantastisch", "adjective", "fantastic", "Das ist fantastisch.", "adjective"],
  ["die", "Farbe", "noun", "color / paint", "Das ist die Farbe.", "other"],
  ["", "farbig", "adjective", "colored / colorful", "Das ist farbig.", "adjective"],
  ["", "fassen", "verb", "to grasp / comprehend / hold", "Ich möchte fassen.", "verb"],
  ["", "fast", "adverb", "almost / nearly", "Ich bin fast fertig.", "adverb"],
  ["", "faul", "adjective", "lazy / rotten", "Das ist faul.", "adjective"],
  ["", "faulenzen", "verb", "to laze around / relax", "Ich möchte faulenzen.", "verb"],
  ["", "fehlen", "verb", "to lack / be missing", "Du fehlst mir.", "verb"],
  ["der", "Fehler", "noun", "mistake / error", "Das ist der Fehler.", "other"],
  ["die", "Feier", "noun", "celebration / party", "Das ist die Feier.", "other"],
  ["der", "Feierabend", "noun", "closing time / end of work", "Das ist der Feierabend.", "time"],
  ["der", "Feiertag", "noun", "public holiday", "Das ist der Feiertag.", "calendar"],
  ["das", "Feld", "noun", "field", "Das ist das Feld.", "places"],
  ["das", "Fenster", "noun", "window", "Das Fenster ist offen.", "house"],
  ["die", "Ferien", "noun", "vacation / school holidays", "Das sind die Ferien.", "calendar"],
  ["die", "Fernbedienung", "noun", "remote control", "Das ist die Fernbedienung.", "electronics"],
  ["", "fernsehen", "verb", "to watch television", "Ich sehe abends fern.", "verb"],
  ["der", "Fernseher", "noun", "television set", "Der Fernseher ist an.", "electronics"],
  ["", "fertig", "adjective", "ready / finished / exhausted", "Das ist fertig.", "adjective"],
  ["", "fest", "adjective", "solid / firm / fixed", "Das ist fest.", "adjective"],
  ["das", "Fest", "noun", "festival / party / feast", "Das ist das Fest.", "other"],
  ["die", "Festplatte", "noun", "hard drive", "Das ist die Festplatte.", "electronics"],
  ["", "festhalten", "verb", "to hold tight / retain", "Ich möchte festhalten.", "verb"],
  ["", "festlegen", "verb", "to determine / set", "Ich möchte festlegen.", "verb"],
  ["", "festnehmen", "verb", "to arrest / detain", "Ich möchte festnehmen.", "verb"],
  ["", "festsetzen", "verb", "to schedule / fix", "Ich möchte festsetzen.", "verb"],
  ["", "feststehen", "verb", "to be certain / established", "Ich möchte feststehen.", "verb"],
  ["", "feststellen", "verb", "to ascertain / realize", "Ich möchte feststellen.", "verb"],
  ["", "fett", "adjective", "fat / greasy", "Das ist fett.", "adjective"],
  ["das", "Fett", "noun", "fat / grease", "Das ist das Fett.", "food"],
  ["", "feucht", "adjective", "damp / moist", "Das ist feucht.", "adjective"],
  ["das", "Feuer", "noun", "fire", "Das ist das Feuer.", "other"],
  ["das", "Feuerzeug", "noun", "lighter", "Das ist das Feuerzeug.", "other"],
  ["die", "Feuerwehr", "noun", "fire brigade", "Das ist die Feuerwehr.", "professions"],
  ["das", "Fieber", "noun", "fever", "Das ist das Fieber.", "body"],
  ["die", "Figur", "noun", "figure / character", "Das ist die Figur.", "body"],
  ["der", "Film", "noun", "film / movie", "Das ist der Film.", "other"],
  ["", "finanzieren", "verb", "to finance / fund", "Ich möchte finanzieren.", "verb"],
  ["", "finanziell", "adjective", "financial", "Das ist finanziell.", "adjective"],
  ["", "finden", "verb", "to find / think (opinion)", "Ich finde den Schlüssel.", "verb"],
  ["der", "Finger", "noun", "finger", "Das ist der Finger.", "body"],
  ["die", "Firma", "noun", "company / firm", "Das ist die Firma.", "professions"],
  ["", "flach", "adjective", "flat / shallow", "Das ist flach.", "adjective"],
  ["die", "Fläche", "noun", "surface / area", "Das ist die Fläche.", "house"],
  ["die", "Flasche", "noun", "bottle", "Das ist die Flasche.", "tableware"],
  ["der", "Fleck", "noun", "stain / spot", "Das ist der Fleck.", "clothing"],
  ["das", "Fleisch", "noun", "meat", "Das ist das Fleisch.", "food"],
  ["", "fleißig", "adjective", "diligent / hardworking", "Das ist fleißig.", "adjective"],
  ["", "flexibel", "adjective", "flexible", "Das ist flexibel.", "adjective"],
  ["", "fliehen", "verb", "to flee / escape", "Ich möchte fliehen.", "verb"],
  ["die", "Flucht", "noun", "escape / flight", "Das ist die Flucht.", "other"],
  ["", "fließen", "verb", "to flow", "Ich möchte fließen.", "verb"],
  ["", "fließend", "adjective", "fluent / running (water)", "Das ist fließend.", "adjective"],
  ["der", "Flohmarkt", "noun", "flea market", "Das ist der Flohmarkt.", "places"],
  ["die", "Flöte", "noun", "flute", "Das ist die Flöte.", "other"],
  ["der", "Flug", "noun", "flight", "Das ist der Flug.", "transport"],
  ["der", "Flughafen", "noun", "airport", "Der Flughafen ist weit weg.", "places"],
  ["das", "Flugzeug", "noun", "airplane", "Das Flugzeug fliegt.", "transport"],
  ["der", "Flur", "noun", "corridor / hallway", "Das ist der Flur.", "house"],
  ["der", "Fluss", "noun", "river", "Das ist der Fluss.", "places"],
  ["die", "Flüssigkeit", "noun", "liquid / fluid", "Das ist die Flüssigkeit.", "food"],
  ["", "folgen", "verb", "to follow", "Ich möchte folgen.", "verb"],
  ["die", "Folge", "noun", "consequence / episode", "Das ist die Folge.", "other"],
  ["", "folgend", "adjective", "following / subsequent", "Das ist folgend.", "adjective"],
  ["", "fordern", "verb", "to demand / require", "Ich möchte fordern.", "verb"],
  ["die", "Forderung", "noun", "demand / claim", "Das ist die Forderung.", "other"],
  ["", "fördern", "verb", "to promote / support / sponsor", "Ich möchte fördern.", "verb"],
  ["die", "Förderung", "noun", "support / grant / subsidy", "Das ist die Förderung.", "other"],
  ["die", "Form", "noun", "shape / form / mold", "Das ist die Form.", "other"],
  ["das", "Formular", "noun", "form (document)", "Das ist das Formular.", "stationery"],
  ["die", "Forschung", "noun", "research", "Das ist die Forschung.", "professions"],
  ["die", "Fortbildung", "noun", "further training / education", "Das ist die Fortbildung.", "professions"],
  ["der", "Fortschritt", "noun", "progress / advancement", "Das ist der Fortschritt.", "other"],
  ["", "fortsetzen", "verb", "to continue / resume", "Ich möchte fortsetzen.", "verb"],
  ["die", "Fortsetzung", "noun", "continuation / sequel", "Das ist die Fortsetzung.", "stationery"],
  ["das", "Forum", "noun", "forum / message board", "Das ist das Forum.", "electronics"],
  ["", "fotografieren", "verb", "to photograph", "Ich möchte fotografieren.", "verb"],
  ["das", "Foto", "noun", "photo / photograph", "Das ist das Foto.", "electronics"],
  ["der", "Fotoapparat", "noun", "camera", "Das ist der Fotoapparat.", "electronics"],
  ["der", "Fotograf", "noun", "photographer", "Das ist der Fotograf.", "professions"],
  ["", "fragen", "verb", "to ask / inquire", "Ich frage den Lehrer.", "verb"],
  ["die", "Frage", "noun", "question", "Ich habe eine Frage.", "other"],
  ["die", "Frau", "noun", "woman / wife / Mrs.", "Das ist die Frau.", "people"],
  ["", "frech", "adjective", "cheeky / insolent", "Das ist frech.", "adjective"],
  ["die", "Freiheit", "noun", "freedom / liberty", "Das ist die Freiheit.", "other"],
  ["die", "Freizeit", "noun", "free time / leisure", "Das ist die Freizeit.", "other"],
  ["", "freiwillig", "adjective", "voluntary / voluntarily", "Das ist freiwillig.", "adjective"],
  ["", "fremd", "adjective", "foreign / unfamiliar", "Das ist fremd.", "adjective"],
  ["", "fressen", "verb", "to eat (animals)", "Ich möchte fressen.", "verb"],
  ["", "sich freuen", "verb", "to be pleased / look forward to", "Ich freue mich.", "verb"],
  ["die", "Freude", "noun", "joy / pleasure", "Das ist die Freude.", "other"],
  ["der", "Freund", "noun", "friend / boyfriend", "Das ist mein Freund.", "people"],
  ["", "freundlich", "adjective", "friendly / kind", "Das ist freundlich.", "adjective"],
  ["die", "Freundschaft", "noun", "friendship", "Das ist die Freundschaft.", "other"],
  ["der", "Friede", "noun", "peace", "Das ist der Friede.", "other"],
  ["", "frieren", "verb", "to freeze / feel cold", "Ich möchte frieren.", "verb"],
  ["der", "Friseur", "noun", "hairdresser / barber", "Das ist der Friseur.", "professions"],
  ["die", "Frisur", "noun", "hairstyle / haircut", "Das ist die Frisur.", "body"],
  ["die", "Frist", "noun", "deadline / period", "Das ist die Frist.", "time"],
  ["", "froh", "adjective", "glad / happy", "Das ist froh.", "adjective"],
  ["", "fröhlich", "adjective", "cheerful / joyful", "Das ist fröhlich.", "adjective"],
  ["die", "Frucht", "noun", "fruit", "Das ist die Frucht.", "food"],
  ["", "früher", "adverb", "earlier / formerly", "Früher wohnte ich hier.", "adverb"],
  ["", "frühstücken", "verb", "to have breakfast", "Ich möchte frühstücken.", "verb"],
  ["das", "Frühstück", "noun", "breakfast", "Das ist das Frühstück.", "food"],
  ["", "fühlen", "verb", "to feel / sense", "Ich möchte fühlen.", "verb"],
  ["", "führen", "verb", "to lead / guide / manage", "Ich möchte führen.", "verb"],
  ["der", "Führerschein", "noun", "driving licence", "Das ist der Führerschein.", "transport"],
  ["die", "Führung", "noun", "guided tour / leadership", "Das ist die Führung.", "places"],
  ["das", "Fundbüro", "noun", "lost and found office", "Das ist das Fundbüro.", "places"],
  ["", "funktionieren", "verb", "to function / work", "Ich möchte funktionieren.", "verb"],
  ["", "furchtbar", "adjective", "terrible / awful", "Das ist furchtbar.", "adjective"],
  ["", "sich fürchten", "verb", "to be afraid / fear", "Ich möchte sich fürchten.", "verb"],
  ["der", "Fuß", "noun", "foot", "Mein Fuß tut weh.", "body"],
  ["der", "Fußball", "noun", "football / soccer ball", "Das ist der Fußball.", "other"],
  ["der", "Fußgänger", "noun", "pedestrian", "Das ist der Fußgänger.", "people"],
  ["die", "Fußgängerzone", "noun", "pedestrian precinct / zone", "Das ist die Fußgängerzone.", "places"],
  ["", "füttern", "verb", "to feed (animals)", "Ich möchte füttern.", "verb"],
  ["die", "Gabel", "noun", "fork", "Das ist die Gabel.", "tableware"],
  ["die", "Galerie", "noun", "gallery", "Das ist die Galerie.", "places"],
  ["der", "Gang", "noun", "corridor / gear / course (meal)", "Das ist der Gang.", "house"],
  ["", "ganz", "adjective", "whole / complete / quite", "Das ist ganz.", "adjective"],
  ["", "gar", "adverb", "at all / cooked", "Ich mache das gar.", "adverb"],
  ["die", "Garage", "noun", "garage", "Das ist die Garage.", "house"],
  ["", "garantieren", "verb", "to guarantee", "Ich möchte garantieren.", "verb"],
  ["die", "Garantie", "noun", "guarantee / warranty", "Das ist die Garantie.", "other"],
  ["die", "Garderobe", "noun", "cloakroom / wardrobe", "Das ist die Garderobe.", "places"],
  ["der", "Garten", "noun", "garden", "Der Garten ist schön.", "house"],
  ["das", "Gas", "noun", "gas", "Das ist das Gas.", "house"],
  ["der", "Gast", "noun", "guest", "Das ist der Gast.", "people"],
  ["das", "Gebäude", "noun", "building", "Das ist das Gebäude.", "places"],
  ["das", "Gebäck", "noun", "pastries / baked goods", "Das ist das Gebäck.", "food"],
  ["das", "Gebiet", "noun", "region / area / field", "Das ist das Gebiet.", "places"],
  ["das", "Gebirge", "noun", "mountain range / mountains", "Das ist das Gebirge.", "places"],
  ["", "gebrauchen", "verb", "to use / utilize", "Ich möchte gebrauchen.", "verb"],
  ["die", "Gebrauchsanweisung", "noun", "operating instructions", "Das ist die Gebrauchsanweisung.", "stationery"],
  ["die", "Gebühr", "noun", "fee / charge", "Das ist die Gebühr.", "other"],
  ["die", "Geburt", "noun", "birth", "Das ist die Geburt.", "other"],
  ["der", "Geburtstag", "noun", "birthday", "Heute ist mein Geburtstag.", "calendar"],
  ["das", "Gedicht", "noun", "poem", "Das ist das Gedicht.", "stationery"],
  ["die", "Geduld", "noun", "patience", "Das ist die Geduld.", "other"],
  ["", "geeignet", "adjective", "suitable / appropriate", "Das ist geeignet.", "adjective"],
  ["die", "Gefahr", "noun", "danger / hazard", "Das ist die Gefahr.", "other"],
  ["", "gefährlich", "adjective", "dangerous / hazardous", "Das ist gefährlich.", "adjective"],
  ["das", "Gefängnis", "noun", "prison / jail", "Das ist das Gefängnis.", "places"],
  ["das", "Gefühl", "noun", "feeling / sensation", "Das ist das Gefühl.", "other"],
  ["", "gegen", "other", "against / around (time)", "Wir spielen gegen eine andere Mannschaft.", "other"],
  ["die", "Gegend", "noun", "area / region / vicinity", "Das ist die Gegend.", "places"],
  ["der", "Gegensatz", "noun", "contrast / opposite", "Das ist der Gegensatz.", "other"],
  ["der", "Gegenstand", "noun", "object / item", "Das ist der Gegenstand.", "other"],
  ["das", "Gegenteil", "noun", "opposite", "Das ist das Gegenteil.", "other"],
  ["", "gegenüber", "other", "opposite / across from", "Die Bank ist gegenüber der Schule.", "places"],
  ["das", "Gehalt", "noun", "salary / wage", "Das ist das Gehalt.", "professions"],
  ["das", "Geheimnis", "noun", "secret", "Das ist das Geheimnis.", "other"],
  ["", "geheim", "adjective", "secret / confidential", "Das ist geheim.", "adjective"],
  ["das", "Geld", "noun", "money", "Ich brauche Geld.", "other"],
  ["der", "Geldautomat", "noun", "ATM / cash dispenser", "Das ist der Geldautomat.", "electronics"],
  ["die", "Gelegenheit", "noun", "opportunity / occasion", "Das ist die Gelegenheit.", "other"],
  ["", "gelingen", "verb", "to succeed / manage", "Ich möchte gelingen.", "verb"],
  ["", "gelten", "verb", "to be valid / apply", "Ich möchte gelten.", "verb"],
  ["", "gemeinsam", "adjective", "together / mutual", "Das ist gemeinsam.", "adjective"],
  ["die", "Gemeinschaft", "noun", "community", "Das ist die Gemeinschaft.", "house"],
  ["das", "Gemüse", "noun", "vegetables", "Das ist das Gemüse.", "food"],
  ["", "gemütlich", "adjective", "cozy / comfortable", "Das ist gemütlich.", "adjective"],
  ["", "genau", "adjective", "exact / precise / accurate", "Das ist genau.", "adjective"],
  ["", "genauso", "adverb", "just as / equally", "Ich mache das genauso.", "adverb"],
  ["", "genehmigen", "verb", "to approve / grant", "Ich möchte genehmigen.", "verb"],
  ["die", "Generation", "noun", "generation", "Das ist die Generation.", "family"],
  ["", "genießen", "verb", "to enjoy / savor", "Ich möchte genießen.", "verb"],
  ["", "genug", "adverb", "enough / sufficient", "Ich mache das genug.", "adverb"],
  ["", "genügen", "verb", "to be enough / suffice", "Ich möchte genügen.", "verb"],
  ["das", "Gepäck", "noun", "luggage / baggage", "Das ist das Gepäck.", "transport"],
  ["", "gerade", "adverb", "straight / just now", "Ich esse gerade.", "adverb"],
  ["das", "Gerät", "noun", "device / appliance", "Das ist das Gerät.", "electronics"],
  ["", "gerecht", "adjective", "fair / just", "Das ist gerecht.", "adjective"],
  ["das", "Gericht", "noun", "court / dish (food)", "Das ist das Gericht.", "food"],
  ["", "gering", "adjective", "low / slight / small", "Das ist gering.", "adjective"],
  ["", "gesamt", "adjective", "total / entire", "Das ist gesamt.", "adjective"],
  ["das", "Geschäft", "noun", "shop / business / deal", "Das Geschäft ist offen.", "places"],
  ["", "geschehen", "verb", "to happen / occur", "Ich möchte geschehen.", "verb"],
  ["das", "Geschenk", "noun", "gift / present", "Das ist das Geschenk.", "other"],
  ["die", "Geschichte", "noun", "story / history", "Das ist die Geschichte.", "stationery"],
  ["", "geschieden", "adjective", "divorced", "Das ist geschieden.", "family"],
  ["das", "Geschirr", "noun", "dishes / crockery", "Das ist das Geschirr.", "tableware"],
  ["das", "Geschlecht", "noun", "gender / sex", "Das ist das Geschlecht.", "other"],
  ["der", "Geschmack", "noun", "taste / flavor", "Das ist der Geschmack.", "food"],
  ["die", "Geschwindigkeit", "noun", "speed / velocity", "Das ist die Geschwindigkeit.", "transport"],
  ["die", "Geschwister", "noun", "siblings", "Das sind die Geschwister.", "family"],
  ["die", "Gesellschaft", "noun", "society / company", "Das ist die Gesellschaft.", "other"],
  ["das", "Gesetz", "noun", "law", "Das ist das Gesetz.", "other"],
  ["das", "Gesicht", "noun", "face", "Ich wasche mein Gesicht.", "body"],
  ["", "gespannt", "adjective", "curious / eager / tense", "Das ist gespannt.", "adjective"],
  ["das", "Gespräch", "noun", "conversation / talk", "Das ist das Gespräch.", "other"],
  ["", "gesund", "adjective", "healthy", "Das ist gesund.", "adjective"],
  ["die", "Gesundheit", "noun", "health", "Das ist die Gesundheit.", "body"],
  ["das", "Getränk", "noun", "drink / beverage", "Ich möchte ein Getränk.", "food"],
  ["die", "Gewalt", "noun", "violence / force", "Das ist die Gewalt.", "other"],
  ["die", "Gewerkschaft", "noun", "trade union", "Das ist die Gewerkschaft.", "professions"],
  ["das", "Gewicht", "noun", "weight", "Das ist das Gewicht.", "other"],
  ["der", "Gewinn", "noun", "profit / prize", "Das ist der Gewinn.", "other"],
  ["das", "Gewissen", "noun", "conscience", "Das ist das Gewissen.", "other"],
  ["das", "Gewitter", "noun", "thunderstorm", "Das ist das Gewitter.", "other"],
  ["", "sich gewöhnen", "verb", "to get used to", "Ich möchte sich gewöhnen.", "verb"],
  ["die", "Gewohnheit", "noun", "habit / custom", "Das ist die Gewohnheit.", "other"],
  ["", "gewohnt", "adjective", "accustomed / used to", "Das ist gewohnt.", "adjective"],
  ["", "gewöhnlich", "adjective", "usual / ordinary", "Das ist gewöhnlich.", "adjective"],
  ["das", "Gewürz", "noun", "spice / seasoning", "Das ist das Gewürz.", "food"],
  ["", "gießen", "verb", "to pour / water (plants)", "Ich möchte gießen.", "verb"],
  ["das", "Gift", "noun", "poison / toxin", "Das ist das Gift.", "other"],
  ["", "giftig", "adjective", "poisonous / toxic", "Das ist giftig.", "adjective"],
  ["die", "Gitarre", "noun", "guitar", "Das ist die Gitarre.", "other"],
  ["das", "Glas", "noun", "glass", "Das ist das Glas.", "tableware"],
  ["", "glatt", "adjective", "smooth / slippery", "Das ist glatt.", "adjective"],
  ["", "gleich", "adverb", "immediately / equal", "Ich komme gleich.", "adverb"],
  ["", "gleichzeitig", "adverb", "simultaneously / at the same time", "Ich mache das gleichzeitig.", "adverb"],
  ["das", "Gleis", "noun", "railway track / platform", "Das ist das Gleis.", "transport"],
  ["das", "Glück", "noun", "luck / happiness", "Das ist das Glück.", "other"],
  ["", "glücklich", "adjective", "happy / fortunate", "Ich bin glücklich.", "adjective"],
  ["der", "Glückwunsch", "noun", "congratulations", "Das ist der Glückwunsch.", "other"],
  ["das", "Gold", "noun", "gold", "Das ist das Gold.", "other"],
  ["der", "Gott", "noun", "God", "Das ist der Gott.", "other"],
  ["die", "Grafik", "noun", "graphic / chart", "Das ist die Grafik.", "stationery"],
  ["das", "Gras", "noun", "grass", "Das ist das Gras.", "other"],
  ["", "gratis", "adjective", "free of charge", "Das ist gratis.", "adjective"],
  ["die", "Grenze", "noun", "border / boundary / limit", "Das ist die Grenze.", "places"],
  ["der", "Grill", "noun", "barbecue / grill", "Das ist der Grill.", "house"],
  ["die", "Grippe", "noun", "influenza / flu", "Das ist die Grippe.", "body"],
  ["", "groß", "adjective", "big / tall / great", "Das ist groß.", "adjective"],
  ["die", "Größe", "noun", "size / height", "Das ist die Größe.", "clothing"],
  ["die", "Großeltern", "noun", "grandparents", "Das sind die Großeltern.", "family"],
  ["die", "Großmutter", "noun", "grandmother", "Das ist die Großmutter.", "family"],
  ["der", "Großvater", "noun", "grandfather", "Das ist der Großvater.", "family"],
  ["die", "Gruppe", "noun", "group", "Das ist die Gruppe.", "other"],
  ["", "gründen", "verb", "to found / establish", "Ich möchte gründen.", "verb"],
  ["der", "Grund", "noun", "reason / ground / basis", "Das ist der Grund.", "other"],
  ["", "gründlich", "adjective", "thorough / thoroughly", "Das ist gründlich.", "adjective"],
  ["das", "Grundstück", "noun", "plot of land / property", "Das ist das Grundstück.", "places"],
  ["", "grüßen", "verb", "to greet / say hello", "Ich möchte grüßen.", "verb"],
  ["der", "Gruß", "noun", "greeting / regards", "Das ist der Gruß.", "other"],
  ["", "gucken", "verb", "to look / peek", "Ich möchte gucken.", "verb"],
  ["", "günstig", "adjective", "favorable / affordable", "Das ist günstig.", "adjective"],
  ["", "gut", "adjective", "good / fine", "Das ist gut.", "adjective"],
  ["die", "Gymnastik", "noun", "gymnastics / physical exercise", "Das ist die Gymnastik.", "body"],
  ["das", "Haar", "noun", "hair", "Das ist das Haar.", "body"],
  ["der", "Hafen", "noun", "harbor / port", "Das ist der Hafen.", "places"],
  ["das", "Hähnchen", "noun", "chicken", "Das ist das Hähnchen.", "food"],
  ["", "halb", "adjective", "half", "Das ist halb.", "adjective"],
  ["die", "Hälfte", "noun", "half", "Das ist die Hälfte.", "other"],
  ["die", "Halbpension", "noun", "half board (hotel)", "Das ist die Halbpension.", "places"],
  ["die", "Halle", "noun", "hall / indoor arena", "Das ist die Halle.", "places"],
  ["", "halten", "verb", "to hold / stop / keep", "Ich möchte halten.", "verb"],
  ["die", "Haltestelle", "noun", "bus/tram stop", "Das ist die Haltestelle.", "transport"],
  ["der", "Hammer", "noun", "hammer", "Das ist der Hammer.", "house"],
  ["die", "Hand", "noun", "hand", "Ich wasche meine Hand.", "body"],
  ["der", "Handwerker", "noun", "craftsman / tradesman", "Das ist der Handwerker.", "professions"],
  ["", "handeln", "verb", "to trade / act / deal with", "Ich möchte handeln.", "verb"],
  ["der", "Handel", "noun", "trade / commerce", "Das ist der Handel.", "professions"],
  ["der", "Händler", "noun", "dealer / trader / merchant", "Das ist der Händler.", "professions"],
  ["das", "Handy", "noun", "mobile phone", "Das ist mein Handy.", "electronics"],
  ["", "hängen", "verb", "to hang / suspend", "Ich möchte hängen.", "verb"],
  ["", "hart", "adjective", "hard / tough", "Das ist hart.", "adjective"],
  ["", "hassen", "verb", "to hate / detest", "Ich möchte hassen.", "verb"],
  ["", "häufig", "adjective", "frequent / often", "Das ist häufig.", "adjective"],
  ["die", "Hauptstadt", "noun", "capital city", "Das ist die Hauptstadt.", "places"],
  ["der", "Hauptbahnhof", "noun", "central railway station", "Das ist der Hauptbahnhof.", "transport"],
  ["das", "Haus", "noun", "house / home", "Das Haus ist groß.", "house"],
  ["die", "Hausaufgabe", "noun", "homework", "Das ist die Hausaufgabe.", "stationery"],
  ["die", "Hausfrau", "noun", "housewife", "Das ist die Hausfrau.", "professions"],
  ["der", "Haushalt", "noun", "household / chores", "Das ist der Haushalt.", "house"],
  ["der", "Hausmeister", "noun", "janitor / caretaker", "Das ist der Hausmeister.", "professions"],
  ["die", "Haut", "noun", "skin", "Das ist die Haut.", "body"],
  ["", "heben", "verb", "to lift / raise", "Ich möchte heben.", "verb"],
  ["das", "Heft", "noun", "notebook / booklet", "Das Heft ist auf dem Tisch.", "stationery"],
  ["die", "Heimat", "noun", "homeland / home country", "Das ist die Heimat.", "places"],
  ["das", "Heimweh", "noun", "homesickness", "Das ist das Heimweh.", "other"],
  ["", "heißen", "verb", "to be called / mean", "Ich heiße Anna.", "verb"],
  ["", "heizen", "verb", "to heat", "Ich möchte heizen.", "verb"],
  ["die", "Heizung", "noun", "heating / radiator", "Das ist die Heizung.", "house"],
  ["die", "Hilfe", "noun", "help / assistance", "Das ist die Hilfe.", "other"],
  ["das", "Hemd", "noun", "shirt", "Ich trage ein Hemd.", "clothing"],
  ["", "herstellen", "verb", "to produce / manufacture", "Ich möchte herstellen.", "verb"],
  ["der", "Hersteller", "noun", "manufacturer / producer", "Das ist der Hersteller.", "professions"],
  ["", "herunterladen", "verb", "to download", "Ich möchte herunterladen.", "verb"],
  ["das", "Herz", "noun", "heart", "Das ist das Herz.", "body"],
  ["", "herzlich", "adjective", "warm / cordial", "Das ist herzlich.", "adjective"],
  ["", "hinten", "adverb", "behind / in the back", "Der Bus ist hinten.", "adverb"],
  ["das", "Hobby", "noun", "hobby", "Das ist das Hobby.", "other"],
  ["die", "Höhe", "noun", "height / altitude", "Das ist die Höhe.", "other"],
  ["die", "Hochzeit", "noun", "wedding", "Das ist die Hochzeit.", "other"],
  ["", "hoffen", "verb", "to hope", "Ich möchte hoffen.", "verb"],
  ["", "hoffentlich", "adverb", "hopefully", "Ich mache das hoffentlich.", "adverb"],
  ["die", "Hoffnung", "noun", "hope", "Das ist die Hoffnung.", "other"],
  ["", "höflich", "adjective", "polite / courteous", "Das ist höflich.", "adjective"],
  ["", "holen", "verb", "to fetch / get", "Ich möchte holen.", "verb"],
  ["das", "Holz", "noun", "wood / timber", "Das ist das Holz.", "other"],
  ["der", "Honig", "noun", "honey", "Das ist der Honig.", "food"],
  ["die", "Hose", "noun", "trousers / pants", "Ich trage eine Hose.", "clothing"],
  ["das", "Hotel", "noun", "hotel", "Das Hotel ist schön.", "places"],
  ["", "hübsch", "adjective", "pretty / handsome", "Das ist hübsch.", "adjective"],
  ["der", "Hügel", "noun", "hill", "Das ist der Hügel.", "places"],
  ["der", "Humor", "noun", "humour", "Das ist der Humor.", "other"],
  ["", "hungrig", "adjective", "hungry", "Das ist hungrig.", "adjective"],
  ["", "husten", "verb", "to cough", "Ich möchte husten.", "verb"],
  ["der", "Husten", "noun", "cough", "Das ist der Husten.", "body"],
  ["der", "Hut", "noun", "hat", "Das ist der Hut.", "clothing"],
  ["die", "Hütte", "noun", "hut / cabin", "Das ist die Hütte.", "places"],
  ["", "ideal", "adjective", "ideal / perfect", "Das ist ideal.", "adjective"],
  ["die", "Idee", "noun", "idea", "Das ist eine gute Idee.", "other"],
  ["", "illegal", "adjective", "illegal / unlawful", "Das ist illegal.", "adjective"],
  ["der", "Imbiss", "noun", "snack bar / snack", "Das ist der Imbiss.", "places"],
  ["", "indem", "other", "by doing / while", "Ich lerne das Wort „indem“.", "other"],
  ["", "individuell", "adjective", "individual / customized", "Das ist individuell.", "adjective"],
  ["die", "Industrie", "noun", "industry", "Das ist die Industrie.", "other"],
  ["die", "Infektion", "noun", "infection", "Das ist die Infektion.", "body"],
  ["", "informieren", "verb", "to inform / find out", "Ich möchte informieren.", "verb"],
  ["die", "Information", "noun", "information", "Das ist die Information.", "other"],
  ["der", "Ingenieur", "noun", "engineer", "Der Ingenieur arbeitet hier.", "professions"],
  ["der", "Inhalt", "noun", "content / table of contents", "Das ist der Inhalt.", "other"],
  ["", "inklusive", "adverb", "inclusive / included", "Ich mache das inklusive.", "adverb"],
  ["", "innen", "adverb", "inside / indoors", "Ich mache das innen.", "house"],
  ["", "innerhalb", "adverb", "within / inside of", "Ich mache das innerhalb.", "time"],
  ["die", "Insel", "noun", "island", "Das ist die Insel.", "places"],
  ["das", "Inserat", "noun", "advertisement / classified ad", "Das ist das Inserat.", "other"],
  ["", "insgesamt", "adverb", "in total / altogether", "Ich mache das insgesamt.", "adverb"],
  ["", "installieren", "verb", "to install / set up", "Ich möchte installieren.", "verb"],
  ["das", "Institut", "noun", "institute", "Das ist das Institut.", "places"],
  ["das", "Instrument", "noun", "musical instrument", "Das ist das Instrument.", "other"],
  ["", "integrieren", "verb", "to integrate", "Ich möchte integrieren.", "verb"],
  ["die", "Integration", "noun", "integration", "Das ist die Integration.", "other"],
  ["", "intelligent", "adjective", "intelligent / clever", "Das ist intelligent.", "adjective"],
  ["", "intensiv", "adjective", "intensive", "Das ist intensiv.", "adjective"],
  ["", "interessieren", "verb", "to interest / be interested", "Ich möchte interessieren.", "verb"],
  ["", "interessant", "adjective", "interesting", "Das ist interessant.", "adjective"],
  ["das", "Interesse", "noun", "interest", "Das ist das Interesse.", "other"],
  ["das", "Internet", "noun", "internet", "Das ist das Internet.", "electronics"],
  ["das", "Interview", "noun", "interview", "Das ist das Interview.", "other"],
  ["", "inzwischen", "adverb", "in the meantime / meanwhile", "Ich mache das inzwischen.", "adverb"],
  ["", "irgendwann", "adverb", "sometime / anytime", "Ich mache das irgendwann.", "adverb"],
  ["", "sich irren", "verb", "to be mistaken / err", "Ich möchte sich irren.", "verb"],
  ["", "ja", "phrase", "yes / indeed", "Ich sage: „ja.“", "other"],
  ["die", "Jacke", "noun", "jacket", "Ich trage eine Jacke.", "clothing"],
  ["", "je", "adverb", "ever / each / per", "Ich mache das je.", "adverb"],
  ["", "je ... desto", "other", "the ... the (comparative)", "Ich lerne das Wort „je ... desto“.", "other"],
  ["die", "Jeans", "noun", "jeans", "Das ist die Jeans.", "clothing"],
  ["", "jeder", "adjective", "each / every / everyone", "Das ist jeder.", "adjective"],
  ["", "jederzeit", "adverb", "anytime / at any time", "Ich mache das jederzeit.", "adverb"],
  ["", "jedes Mal", "phrase", "every time", "Ich sage: „jedes Mal.“", "time"],
  ["", "jedoch", "adverb", "however / though", "Ich mache das jedoch.", "adverb"],
  ["", "jemals", "adverb", "ever", "Ich mache das jemals.", "adverb"],
  ["", "jemand", "other", "someone / somebody", "Ich lerne das Wort „jemand“.", "people"],
  ["", "jetzt", "adverb", "now / currently", "Jetzt lerne ich Deutsch.", "time"],
  ["", "jeweils", "adverb", "in each case / respectively", "Ich mache das jeweils.", "adverb"],
  ["der", "Job", "noun", "job", "Das ist der Job.", "professions"],
  ["der", "Journalist", "noun", "journalist / reporter", "Das ist der Journalist.", "professions"],
  ["die", "Jugend", "noun", "youth / adolescence", "Das ist die Jugend.", "other"],
  ["der", "Jugendliche", "noun", "teenager / adolescent", "Das ist der Jugendliche.", "people"],
  ["die", "Jugendherberge", "noun", "youth hostel", "Das ist die Jugendherberge.", "places"],
  ["der", "Junge", "noun", "boy", "Das ist der Junge.", "people"],
  ["das", "Kabel", "noun", "cable / wire", "Das ist das Kabel.", "electronics"],
  ["die", "Kabine", "noun", "cabin / booth", "Das ist die Kabine.", "places"],
  ["der", "Kaffee", "noun", "coffee", "Ich trinke Kaffee.", "food"],
  ["der", "Kakao", "noun", "cocoa / hot chocolate", "Das ist der Kakao.", "food"],
  ["der", "Kalender", "noun", "calendar / diary", "Das ist der Kalender.", "stationery"],
  ["die", "Kälte", "noun", "cold / coldness", "Das ist die Kälte.", "other"],
  ["die", "Kamera", "noun", "camera", "Das ist die Kamera.", "electronics"],
  ["", "kämpfen", "verb", "to fight / struggle", "Ich möchte kämpfen.", "verb"],
  ["der", "Kampf", "noun", "fight / battle / match", "Das ist der Kampf.", "other"],
  ["der", "Kanal", "noun", "channel / canal", "Das ist der Kanal.", "electronics"],
  ["der", "Kandidat", "noun", "candidate / applicant", "Das ist der Kandidat.", "people"],
  ["die", "Kanne", "noun", "pot / jug / pitcher", "Das ist die Kanne.", "tableware"],
  ["die", "Kantine", "noun", "canteen / cafeteria", "Das ist die Kantine.", "places"],
  ["das", "Kapitel", "noun", "chapter", "Das ist das Kapitel.", "stationery"],
  ["", "kaputt", "adjective", "broken / out of order / exhausted", "Mein Handy ist kaputt.", "adjective"],
  ["", "kaputtgehen", "verb", "to break / get ruined", "Ich möchte kaputtgehen.", "verb"],
  ["", "kaputtmachen", "verb", "to break / destroy", "Ich möchte kaputtmachen.", "verb"],
  ["die", "Karriere", "noun", "career", "Das ist die Karriere.", "professions"],
  ["die", "Karte", "noun", "card / ticket / menu / map", "Das ist die Karte.", "stationery"],
  ["die", "Kartoffel", "noun", "potato", "Das ist die Kartoffel.", "food"],
  ["der", "Käse", "noun", "cheese", "Das ist der Käse.", "food"],
  ["die", "Kasse", "noun", "cash register / checkout", "Das ist die Kasse.", "places"],
  ["die", "Kassette", "noun", "cassette / audio tape", "Das ist die Kassette.", "electronics"],
  ["der", "Katalog", "noun", "catalogue", "Das ist der Katalog.", "stationery"],
  ["die", "Katastrophe", "noun", "catastrophe / disaster", "Das ist die Katastrophe.", "other"],
  ["", "kaufen", "verb", "to buy / purchase", "Ich kaufe Brot.", "verb"],
  ["der", "Kauf", "noun", "purchase / bargain", "Das ist der Kauf.", "other"],
  ["der", "Käufer", "noun", "buyer / customer", "Das ist der Käufer.", "people"],
  ["", "kaum", "adverb", "hardly / barely / scarcely", "Ich mache das kaum.", "adverb"],
  ["", "kein", "other", "no / not any / none", "Ich habe kein Auto.", "other"],
  ["der", "Keller", "noun", "cellar / basement", "Das ist der Keller.", "house"],
  ["der", "Kellner", "noun", "waiter / server", "Der Kellner bringt das Essen.", "professions"],
  ["", "kennen", "verb", "to know (people/places)", "Ich kenne Berlin.", "verb"],
  ["", "kennenlernen", "verb", "to get to know / meet", "Ich möchte kennenlernen.", "verb"],
  ["die", "Kenntnisse", "noun", "knowledge / skills", "Das ist die Kenntnisse.", "professions"],
  ["das", "Kennzeichen", "noun", "licence plate / indicator", "Das ist das Kennzeichen.", "transport"],
  ["die", "Kerze", "noun", "candle", "Das ist die Kerze.", "house"],
  ["die", "Kette", "noun", "necklace / chain", "Das ist die Kette.", "other"],
  ["das", "Kind", "noun", "child", "Das ist ein Kind.", "people"],
  ["der", "Kindergarten", "noun", "kindergarten / day nursery", "Das ist der Kindergarten.", "places"],
  ["die", "Kindheit", "noun", "childhood", "Das ist die Kindheit.", "other"],
  ["das", "Kino", "noun", "cinema / movie theater", "Das ist das Kino.", "places"],
  ["der", "Kiosk", "noun", "kiosk / newsstand", "Das ist der Kiosk.", "places"],
  ["die", "Kirche", "noun", "church", "Das ist die Kirche.", "places"],
  ["das", "Kissen", "noun", "cushion / pillow", "Das ist das Kissen.", "furniture"],
  ["", "klagen", "verb", "to complain / sue", "Ich möchte klagen.", "verb"],
  ["", "klappen", "verb", "to work out / go smoothly", "Ich möchte klappen.", "verb"],
  ["", "klar", "adjective", "clear / obvious / of course", "Das ist klar.", "adjective"],
  ["", "klären", "verb", "to clarify / resolve", "Ich möchte klären.", "verb"],
  ["die", "Klasse", "noun", "class / grade / classroom", "Das ist die Klasse.", "other"],
  ["das", "Klavier", "noun", "piano", "Das ist das Klavier.", "other"],
  ["", "kleben", "verb", "to stick / glue / paste", "Ich möchte kleben.", "verb"],
  ["das", "Kleid", "noun", "dress", "Das ist das Kleid.", "clothing"],
  ["die", "Kleidung", "noun", "clothing / clothes", "Das ist die Kleidung.", "clothing"],
  ["", "klein", "adjective", "small / little", "Das ist klein.", "adjective"],
  ["", "klettern", "verb", "to climb", "Ich möchte klettern.", "verb"],
  ["", "klicken", "verb", "to click", "Ich möchte klicken.", "verb"],
  ["das", "Klima", "noun", "climate", "Das ist das Klima.", "other"],
  ["die", "Klimaanlage", "noun", "air conditioning", "Das ist die Klimaanlage.", "house"],
  ["", "klingeln", "verb", "to ring (doorbell/phone)", "Ich möchte klingeln.", "verb"],
  ["die", "Klingel", "noun", "doorbell / bell", "Das ist die Klingel.", "house"],
  ["", "klingen", "verb", "to sound", "Ich möchte klingen.", "verb"],
  ["die", "Klinik", "noun", "clinic / hospital", "Das ist die Klinik.", "places"],
  ["", "klopfen", "verb", "to knock", "Ich möchte klopfen.", "verb"],
  ["", "klug", "adjective", "clever / smart / wise", "Das ist klug.", "adjective"],
  ["", "knapp", "adjective", "scarce / tight / barely", "Das ist knapp.", "adjective"],
  ["das", "Knie", "noun", "knee", "Das ist das Knie.", "body"],
  ["der", "Knochen", "noun", "bone", "Das ist der Knochen.", "body"],
  ["der", "Knopf", "noun", "button", "Das ist der Knopf.", "clothing"],
  ["", "kochen", "verb", "to cook / boil", "Ich koche heute.", "verb"],
  ["der", "Koch", "noun", "cook / chef", "Das ist der Koch.", "professions"],
  ["der", "Koffer", "noun", "suitcase", "Das ist der Koffer.", "transport"],
  ["der", "Kollege", "noun", "colleague / coworker", "Das ist der Kollege.", "professions"],
  ["", "komisch", "adjective", "strange / funny / odd", "Das ist komisch.", "adjective"],
  ["", "kommen", "verb", "to come / arrive", "Ich komme morgen.", "verb"],
  ["die", "Kommunikation", "noun", "communication", "Das ist die Kommunikation.", "other"],
  ["", "komplett", "adjective", "complete / completely", "Das ist komplett.", "adjective"],
  ["", "kompliziert", "adjective", "complicated / complex", "Das ist kompliziert.", "adjective"],
  ["der", "Kompromiss", "noun", "compromise", "Das ist der Kompromiss.", "other"],
  ["die", "Konferenz", "noun", "conference", "Das ist die Konferenz.", "professions"],
  ["der", "Konflikt", "noun", "conflict", "Das ist der Konflikt.", "other"],
  ["der", "König", "noun", "king", "Das ist der König.", "people"],
  ["die", "Konkurrenz", "noun", "competition / competitors", "Das ist die Konkurrenz.", "professions"],
  ["das", "Konsulat", "noun", "consulate", "Das ist das Konsulat.", "places"],
  ["", "konsumieren", "verb", "to consume", "Ich möchte konsumieren.", "verb"],
  ["der", "Konsum", "noun", "consumption", "Das ist der Konsum.", "other"],
  ["der", "Kontakt", "noun", "contact / connection", "Das ist der Kontakt.", "other"],
  ["das", "Konto", "noun", "bank account", "Das ist das Konto.", "other"],
  ["", "kontrollieren", "verb", "to check / inspect / control", "Ich möchte kontrollieren.", "verb"],
  ["die", "Kontrolle", "noun", "inspection / check / control", "Das ist die Kontrolle.", "other"],
  ["", "sich konzentrieren", "verb", "to concentrate / focus", "Ich möchte sich konzentrieren.", "verb"],
  ["das", "Konzert", "noun", "concert", "Das ist das Konzert.", "other"],
  ["der", "Kopf", "noun", "head / mind", "Mein Kopf tut weh.", "body"],
  ["", "kopieren", "verb", "to copy / photocopy", "Ich möchte kopieren.", "verb"],
  ["die", "Kopie", "noun", "copy / duplicate", "Das ist die Kopie.", "stationery"],
  ["der", "Körper", "noun", "body", "Das ist der Körper.", "body"],
  ["", "körperlich", "adjective", "physical / bodily", "Das ist körperlich.", "adjective"],
  ["", "korrekt", "adjective", "correct / accurate", "Das ist korrekt.", "adjective"],
  ["", "korrigieren", "verb", "to correct", "Ich möchte korrigieren.", "verb"],
  ["", "kosten", "verb", "to cost / taste", "Das kostet fünf Euro.", "verb"],
  ["die", "Kosten", "noun", "costs / expenses", "Das sind die Kosten.", "other"],
  ["", "kostenlos", "adjective", "free of charge", "Das ist kostenlos.", "adjective"],
  ["das", "Kostüm", "noun", "costume / suit (female)", "Das ist das Kostüm.", "clothing"],
  ["die", "Kraft", "noun", "strength / power", "Das ist die Kraft.", "body"],
  ["", "kräftig", "adjective", "strong / powerful / hearty", "Das ist kräftig.", "adjective"],
  ["das", "Kraftfahrzeug", "noun", "motor vehicle (Kfz)", "Das ist das Kraftfahrzeug.", "transport"],
  ["der", "Kranke", "noun", "sick person / patient", "Das ist der Kranke.", "people"],
  ["das", "Krankenhaus", "noun", "hospital", "Das ist das Krankenhaus.", "places"],
  ["die", "Krankenkasse", "noun", "health insurance company", "Das ist die Krankenkasse.", "professions"],
  ["der", "Krankenpfleger", "noun", "male nurse", "Das ist der Krankenpfleger.", "professions"],
  ["die", "Krankenschwester", "noun", "female nurse", "Das ist die Krankenschwester.", "professions"],
  ["der", "Krankenwagen", "noun", "ambulance", "Das ist der Krankenwagen.", "transport"],
  ["die", "Krankheit", "noun", "illness / disease", "Das ist die Krankheit.", "body"],
  ["", "kreativ", "adjective", "creative", "Das ist kreativ.", "adjective"],
  ["der", "Kredit", "noun", "credit / loan", "Das ist der Kredit.", "other"],
  ["die", "Kreditkarte", "noun", "credit card", "Das ist die Kreditkarte.", "other"],
  ["der", "Kreis", "noun", "circle / district", "Das ist der Kreis.", "other"],
  ["das", "Kreuz", "noun", "cross", "Das ist das Kreuz.", "other"],
  ["die", "Kreuzung", "noun", "intersection / crossroads", "Das ist die Kreuzung.", "transport"],
  ["der", "Krieg", "noun", "war", "Das ist der Krieg.", "other"],
  ["die", "Kriminalpolizei", "noun", "detective branch / CID", "Das ist die Kriminalpolizei.", "professions"],
  ["der", "Krimi", "noun", "crime story / thriller", "Das ist der Krimi.", "other"],
  ["die", "Krise", "noun", "crisis", "Das ist die Krise.", "other"],
  ["", "kritisieren", "verb", "to criticize", "Ich möchte kritisieren.", "verb"],
  ["die", "Kritik", "noun", "criticism / review", "Das ist die Kritik.", "other"],
  ["", "kritisch", "adjective", "critical", "Das ist kritisch.", "adjective"],
  ["die", "Küche", "noun", "kitchen / cuisine", "Die Küche ist sauber.", "house"],
  ["der", "Kuchen", "noun", "cake", "Das ist der Kuchen.", "food"],
  ["der", "Kugelschreiber", "noun", "ballpoint pen", "Das ist ein Kugelschreiber.", "stationery"],
  ["", "kühl", "adjective", "cool / chilly", "Das ist kühl.", "adjective"],
  ["der", "Kühlschrank", "noun", "refrigerator / fridge", "Das ist der Kühlschrank.", "electronics"],
  ["die", "Kultur", "noun", "culture", "Das ist die Kultur.", "other"],
  ["", "sich kümmern", "verb", "to take care of / look after", "Ich kümmere mich darum.", "verb"],
  ["der", "Kunde", "noun", "customer / client", "Der Kunde bezahlt.", "people"],
  ["", "kündigen", "verb", "to give notice / terminate / quit", "Ich möchte kündigen.", "verb"],
  ["die", "Kündigung", "noun", "notice / termination", "Das ist die Kündigung.", "other"],
  ["die", "Kunst", "noun", "art", "Das ist die Kunst.", "other"],
  ["der", "Künstler", "noun", "artist", "Das ist der Künstler.", "professions"],
  ["", "künstlich", "adjective", "artificial / synthetic", "Das ist künstlich.", "adjective"],
  ["der", "Kunststoff", "noun", "plastic / synthetic material", "Das ist der Kunststoff.", "other"],
  ["der", "Kurs", "noun", "course / class / exchange rate", "Das ist der Kurs.", "other"],
  ["der", "Kursleiter", "noun", "course instructor / tutor", "Das ist der Kursleiter.", "professions"],
  ["die", "Kurve", "noun", "curve / bend", "Das ist die Kurve.", "transport"],
  ["", "kürzlich", "adverb", "recently / lately", "Ich mache das kürzlich.", "adverb"],
  ["", "küssen", "verb", "to kiss", "Ich möchte küssen.", "verb"],
  ["der", "Kuss", "noun", "kiss", "Das ist der Kuss.", "other"],
  ["die", "Küste", "noun", "coast / shoreline", "Das ist die Küste.", "places"],
  ["", "lächeln", "verb", "to smile", "Ich möchte lächeln.", "verb"],
  ["der", "Laden", "noun", "shop / store", "Das ist der Laden.", "places"],
  ["die", "Lage", "noun", "location / situation", "Das ist die Lage.", "places"],
  ["das", "Lager", "noun", "warehouse / storage / camp", "Das ist das Lager.", "places"],
  ["die", "Lampe", "noun", "lamp / light", "Die Lampe ist hell.", "furniture"],
  ["das", "Land", "noun", "country / countryside / land", "Das ist das Land.", "places"],
  ["die", "Landwirtschaft", "noun", "agriculture / farming", "Das ist die Landwirtschaft.", "professions"],
  ["die", "Landschaft", "noun", "landscape / scenery", "Das ist die Landschaft.", "places"],
  ["", "landen", "verb", "to land", "Ich möchte landen.", "verb"],
  ["die", "Landung", "noun", "landing", "Das ist die Landung.", "transport"],
  ["die", "Länge", "noun", "length", "Das ist die Länge.", "other"],
  ["", "langsam", "adjective", "slow / slowly", "Das ist langsam.", "adjective"],
  ["", "längst", "adverb", "long ago / already", "Ich mache das längst.", "adverb"],
  ["", "langweilig", "adjective", "boring / dull", "Das ist langweilig.", "adjective"],
  ["", "sich langweilen", "verb", "to be bored", "Ich möchte sich langweilen.", "verb"],
  ["die", "Langeweile", "noun", "boredom", "Das ist die Langeweile.", "other"],
  ["der", "Lärm", "noun", "noise / din", "Das ist der Lärm.", "other"],
  ["", "lassen", "verb", "to let / allow / leave / have done", "Ich möchte lassen.", "verb"],
  ["der", "Laster", "noun", "truck / heavy goods vehicle", "Das ist der Laster.", "transport"],
  ["", "laufen", "verb", "to run / walk", "Ich laufe im Park.", "verb"],
  ["das", "Laufwerk", "noun", "drive (computer)", "Das ist das Laufwerk.", "electronics"],
  ["die", "Laune", "noun", "mood / temper", "Das ist die Laune.", "other"],
  ["", "laut", "adjective", "loud / loudly / according to", "Die Musik ist laut.", "adjective"],
  ["der", "Lautsprecher", "noun", "loudspeaker / speaker", "Das ist der Lautsprecher.", "electronics"],
  ["", "leben", "verb", "to live / be alive", "Ich möchte leben.", "verb"],
  ["das", "Leben", "noun", "life", "Das ist das Leben.", "other"],
  ["der", "Lebenslauf", "noun", "curriculum vitae / résumé", "Das ist der Lebenslauf.", "stationery"],
  ["die", "Lebensmittel", "noun", "groceries / foodstuffs", "Das sind die Lebensmittel.", "food"],
  ["das", "Leder", "noun", "leather", "Das ist das Leder.", "clothing"],
  ["", "leer", "adjective", "empty / vacant", "Das ist leer.", "adjective"],
  ["", "legen", "verb", "to lay / place / put down", "Ich möchte legen.", "verb"],
  ["die", "Lehre", "noun", "apprenticeship / training", "Das ist die Lehre.", "professions"],
  ["die", "Lehrstelle", "noun", "apprenticeship position", "Das ist die Lehrstelle.", "professions"],
  ["der", "Lehrer", "noun", "teacher (male)", "Der Lehrer erklärt die Aufgabe.", "professions"],
  ["die", "Lehrerin", "noun", "teacher (female)", "Die Lehrerin erklärt die Aufgabe.", "professions"],
  ["der", "Lehrling", "noun", "apprentice / trainee", "Das ist der Lehrling.", "professions"],
  ["", "leicht", "adjective", "light (weight) / easy", "Das ist leicht.", "adjective"],
  ["", "leidtun", "verb", "to be sorry / regret", "Ich möchte leidtun.", "verb"],
  ["", "leiden", "verb", "to suffer", "Ich möchte leiden.", "verb"],
  ["", "leider", "adverb", "unfortunately / regrettably", "Ich mache das leider.", "adverb"],
  ["", "leihen", "verb", "to lend / borrow", "Ich möchte leihen.", "verb"],
  ["", "leise", "adjective", "quiet / soft (sound)", "Bitte sei leise.", "adjective"],
  ["", "leisten", "verb", "to afford / achieve / render", "Ich möchte leisten.", "verb"],
  ["die", "Leistung", "noun", "performance / achievement", "Das ist die Leistung.", "other"],
  ["", "leiten", "verb", "to lead / manage / direct", "Ich möchte leiten.", "verb"],
  ["der", "Leiter", "noun", "manager / director / head", "Das ist der Leiter.", "professions"],
  ["die", "Leitung", "noun", "management / pipeline / line", "Das ist die Leitung.", "other"],
  ["die", "Leiter", "noun", "ladder", "Das ist die Leiter.", "house"],
  ["", "lernen", "verb", "to learn / study", "Ich lerne Deutsch.", "verb"],
  ["der", "Leser", "noun", "reader", "Das ist der Leser.", "people"],
  ["", "letzt", "adjective", "last / previous", "Das ist letzt.", "adjective"],
  ["die", "Leute", "noun", "people", "Das sind die Leute.", "people"],
  ["das", "Licht", "noun", "light", "Das ist das Licht.", "house"],
  ["", "lieb", "adjective", "dear / kind / nice", "Das ist lieb.", "adjective"],
  ["die", "Liebe", "noun", "love", "Das ist die Liebe.", "other"],
  ["das", "Lied", "noun", "song", "Das ist das Lied.", "other"],
  ["", "liefern", "verb", "to deliver / supply", "Ich möchte liefern.", "verb"],
  ["die", "Lieferung", "noun", "delivery", "Das ist die Lieferung.", "other"],
  ["", "liegen", "verb", "to lie / be situated", "Ich möchte liegen.", "verb"],
  ["", "links", "adverb", "on the left / to the left", "Gehen Sie links.", "places"],
  ["die", "Lippe", "noun", "lip", "Das ist die Lippe.", "body"],
  ["die", "Liste", "noun", "list", "Das ist die Liste.", "stationery"],
  ["die", "Literatur", "noun", "literature", "Das ist die Literatur.", "other"],
  ["", "loben", "verb", "to praise", "Ich möchte loben.", "verb"],
  ["das", "Loch", "noun", "hole", "Das ist das Loch.", "clothing"],
  ["", "locker", "adjective", "loose / relaxed", "Das ist locker.", "adjective"],
  ["der", "Löffel", "noun", "spoon", "Das ist der Löffel.", "tableware"],
  ["der", "Lohn", "noun", "wage / pay", "Das ist der Lohn.", "professions"],
  ["", "sich lohnen", "verb", "to be worthwhile / pay off", "Ich möchte sich lohnen.", "verb"],
  ["das", "Lokal", "noun", "pub / restaurant / venue", "Das ist das Lokal.", "places"],
  ["", "los", "adjective", "loose / going on / off", "Das ist los.", "other"],
  ["", "losfahren", "verb", "to set off / depart (by vehicle)", "Ich möchte losfahren.", "verb"],
  ["", "löschen", "verb", "to extinguish / delete", "Ich möchte löschen.", "verb"],
  ["", "lösen", "verb", "to solve / loosen / buy (ticket)", "Ich möchte lösen.", "verb"],
  ["die", "Lösung", "noun", "solution / answer", "Das ist die Lösung.", "other"],
  ["die", "Luft", "noun", "air", "Das ist die Luft.", "other"],
  ["", "lügen", "verb", "to lie / tell a lie", "Ich möchte lügen.", "verb"],
  ["die", "Lüge", "noun", "lie / falsehood", "Das ist die Lüge.", "other"],
  ["die", "Lust", "noun", "desire / mood / pleasure", "Das ist die Lust.", "other"],
  ["", "lustig", "adjective", "funny / amusing", "Das ist lustig.", "adjective"],
  ["das", "Mädchen", "noun", "girl", "Das ist das Mädchen.", "people"],
  ["das", "Magazin", "noun", "magazine", "Das ist das Magazin.", "stationery"],
  ["der", "Magen", "noun", "stomach", "Das ist der Magen.", "body"],
  ["", "mager", "adjective", "lean / thin (meat)", "Das ist mager.", "food"],
  ["die", "Mahlzeit", "noun", "meal / repast", "Das ist die Mahlzeit.", "food"],
  ["die", "Mahnung", "noun", "reminder / warning / overdue notice", "Das ist die Mahnung.", "stationery"],
  ["das", "Mal", "noun", "time / occasion", "Das ist das Mal.", "time"],
  ["", "malen", "verb", "to paint / draw", "Ich möchte malen.", "verb"],
  ["der", "Maler", "noun", "painter / decorator", "Das ist der Maler.", "professions"],
  ["", "man", "other", "one / you / people (pronoun)", "Man lernt jeden Tag.", "other"],
  ["", "mancher", "adjective", "some / many a", "Das ist mancher.", "adjective"],
  ["", "manchmal", "adverb", "sometimes / occasionally", "Manchmal sehe ich fern.", "adverb"],
  ["der", "Mangel", "noun", "lack / shortage / defect", "Das ist der Mangel.", "other"],
  ["der", "Mann", "noun", "man / husband", "Das ist der Mann.", "people"],
  ["", "männlich", "adjective", "male / masculine", "Die Person ist männlich.", "other"],
  ["die", "Mannschaft", "noun", "team / crew", "Das ist die Mannschaft.", "other"],
  ["der", "Mantel", "noun", "coat / overcoat", "Das ist der Mantel.", "clothing"],
  ["die", "Mappe", "noun", "folder / portfolio", "Das ist die Mappe.", "stationery"],
  ["das", "Märchen", "noun", "fairy tale", "Das ist das Märchen.", "stationery"],
  ["die", "Margarine", "noun", "margarine", "Das ist die Margarine.", "food"],
  ["die", "Marke", "noun", "brand / trademark / stamp", "Das ist die Marke.", "other"],
  ["", "markieren", "verb", "to mark / highlight", "Ich möchte markieren.", "verb"],
  ["der", "Markt", "noun", "market / marketplace", "Der Markt ist heute offen.", "places"],
  ["die", "Marmelade", "noun", "jam / marmalade", "Das ist die Marmelade.", "food"],
  ["die", "Maschine", "noun", "machine / engine", "Das ist die Maschine.", "electronics"],
  ["das", "Material", "noun", "material / fabric", "Das ist das Material.", "other"],
  ["die", "Mauer", "noun", "wall (brick/stone)", "Das ist die Mauer.", "house"],
  ["", "maximal", "adjective", "maximum", "Das ist maximal.", "adjective"],
  ["der", "Mechaniker", "noun", "mechanic", "Das ist der Mechaniker.", "professions"],
  ["die", "Medien", "noun", "media (press/broadcasting)", "Das ist die Medien.", "other"],
  ["das", "Medikament", "noun", "medication / medicine", "Das ist das Medikament.", "body"],
  ["die", "Medizin", "noun", "medicine (science/drug)", "Das ist die Medizin.", "professions"],
  ["das", "Meer", "noun", "sea / ocean", "Das ist das Meer.", "places"],
  ["das", "Mehl", "noun", "flour", "Das ist das Mehl.", "food"],
  ["", "mehrere", "adjective", "several / multiple", "Das ist mehrere.", "adjective"],
  ["die", "Mehrheit", "noun", "majority", "Das ist die Mehrheit.", "other"],
  ["die", "Mehrwertsteuer", "noun", "value added tax (VAT)", "Das ist die Mehrwertsteuer.", "other"],
  ["", "meinen", "verb", "to think / mean / believe", "Ich möchte meinen.", "verb"],
  ["die", "Meinung", "noun", "opinion / view", "Das ist die Meinung.", "other"],
  ["", "meist", "adverb", "mostly / usually", "Ich mache das meist.", "adverb"],
  ["der", "Meister", "noun", "master craftsman / champion", "Das ist der Meister.", "professions"],
  ["", "melden", "verb", "to report / get in touch", "Ich möchte melden.", "verb"],
  ["die", "Meldung", "noun", "report / announcement / message", "Das ist die Meldung.", "other"],
  ["die", "Menge", "noun", "quantity / crowd / lot", "Das ist die Menge.", "other"],
  ["die", "Mensa", "noun", "university canteen", "Das ist die Mensa.", "places"],
  ["der", "Mensch", "noun", "human being / person", "Das ist der Mensch.", "people"],
  ["", "menschlich", "adjective", "human / humane", "Das ist menschlich.", "adjective"],
  ["das", "Menü", "noun", "set menu / computer menu", "Das ist das Menü.", "food"],
  ["", "merken", "verb", "to notice / remember", "Ich möchte merken.", "verb"],
  ["", "merkwürdig", "adjective", "strange / peculiar / odd", "Das ist merkwürdig.", "adjective"],
  ["die", "Messe", "noun", "trade fair / exhibition", "Das ist die Messe.", "places"],
  ["", "messen", "verb", "to measure", "Ich möchte messen.", "verb"],
  ["das", "Messer", "noun", "knife", "Das ist das Messer.", "tableware"],
  ["das", "Metall", "noun", "metal", "Das ist das Metall.", "other"],
  ["die", "Methode", "noun", "method / technique", "Das ist die Methode.", "other"],
  ["die", "Metropole", "noun", "metropolis / major city", "Das ist die Metropole.", "places"],
  ["der", "Metzger", "noun", "butcher", "Das ist der Metzger.", "professions"],
  ["", "mieten", "verb", "to rent / hire", "Ich möchte eine Wohnung mieten.", "verb"],
  ["die", "Miete", "noun", "rent", "Das ist die Miete.", "house"],
  ["der", "Mieter", "noun", "tenant / renter", "Das ist der Mieter.", "people"],
  ["die", "Migration", "noun", "migration", "Das ist die Migration.", "other"],
  ["die", "Milch", "noun", "milk", "Ich trinke Milch.", "food"],
  ["", "mild", "adjective", "mild / gentle", "Das ist mild.", "adjective"],
  ["die", "Minderheit", "noun", "minority", "Das ist die Minderheit.", "other"],
  ["", "mindestens", "adverb", "at least", "Ich mache das mindestens.", "adverb"],
  ["das", "Mineralwasser", "noun", "mineral water", "Das ist das Mineralwasser.", "food"],
  ["", "mischen", "verb", "to mix / blend", "Ich möchte mischen.", "verb"],
  ["", "missverstehen", "verb", "to misunderstand", "Ich möchte missverstehen.", "verb"],
  ["das", "Missverständnis", "noun", "misunderstanding", "Das ist das Missverständnis.", "other"],
  ["der", "Mitarbeiter", "noun", "employee / coworker / staff", "Das ist der Mitarbeiter.", "professions"],
  ["", "miteinander", "adverb", "with each other / together", "Ich mache das miteinander.", "adverb"],
  ["das", "Mitglied", "noun", "member", "Das ist das Mitglied.", "people"],
  ["die", "Mitte", "noun", "middle / center", "Das ist die Mitte.", "places"],
  ["", "mitteilen", "verb", "to inform / communicate", "Ich möchte mitteilen.", "verb"],
  ["das", "Mittel", "noun", "means / remedy / agent", "Das ist das Mittel.", "body"],
  ["", "mitten", "adverb", "in the middle / midst", "Ich mache das mitten.", "adverb"],
  ["", "mittlerweile", "adverb", "meanwhile / by now", "Ich mache das mittlerweile.", "adverb"],
  ["die", "Möbel", "noun", "furniture", "Das sind die Möbel.", "furniture"],
  ["", "möbliert", "adjective", "furnished", "Das ist möbliert.", "house"],
  ["", "möchten", "verb", "would like (to)", "Ich möchte einen Kaffee.", "verb"],
  ["die", "Möglichkeit", "noun", "possibility / opportunity", "Das ist die Möglichkeit.", "other"],
  ["", "möglichst", "adverb", "as ... as possible", "Ich mache das möglichst.", "adverb"],
  ["die", "Mode", "noun", "fashion / trend", "Das ist die Mode.", "clothing"],
  ["das", "Modell", "noun", "model / design", "Das ist das Modell.", "transport"],
  ["", "modern", "adjective", "modern / contemporary", "Das ist modern.", "adjective"],
  ["der", "Moment", "noun", "moment", "Warte einen Moment.", "time"],
  ["der", "Mond", "noun", "moon", "Das ist der Mond.", "other"],
  ["der", "Monitor", "noun", "monitor / screen", "Das ist der Monitor.", "electronics"],
  ["der", "Motor", "noun", "engine / motor", "Das ist der Motor.", "transport"],
  ["das", "Motorrad", "noun", "motorcycle", "Das Motorrad ist schnell.", "transport"],
  ["", "müde", "adjective", "tired / sleepy", "Ich bin müde.", "adjective"],
  ["die", "Mühe", "noun", "effort / trouble", "Das ist die Mühe.", "other"],
  ["der", "Müll", "noun", "rubbish / garbage / waste", "Das ist der Müll.", "house"],
  ["die", "Müllabfuhr", "noun", "refuse collection", "Das ist die Müllabfuhr.", "professions"],
  ["die", "Mülltonne", "noun", "dustbin / trash can", "Das ist die Mülltonne.", "house"],
  ["der", "Mund", "noun", "mouth", "Mein Mund ist trocken.", "body"],
  ["", "mündlich", "adjective", "oral / verbal", "Das ist mündlich.", "stationery"],
  ["die", "Münze", "noun", "coin", "Das ist die Münze.", "other"],
  ["das", "Museum", "noun", "museum", "Das ist das Museum.", "places"],
  ["die", "Musik", "noun", "music", "Das ist die Musik.", "other"],
  ["", "musikalisch", "adjective", "musical / musically gifted", "Das ist musikalisch.", "adjective"],
  ["der", "Musiker", "noun", "musician", "Das ist der Musiker.", "professions"],
  ["der", "Muskel", "noun", "muscle", "Das ist der Muskel.", "body"],
  ["das", "Müsli", "noun", "muesli / granola", "Das ist das Müsli.", "food"],
  ["der", "Mut", "noun", "courage / bravery", "Das ist der Mut.", "other"],
  ["", "mutig", "adjective", "brave / courageous", "Das ist mutig.", "adjective"],
  ["die", "Mutter", "noun", "mother", "Das ist meine Mutter.", "family"],
  ["", "nach", "other", "after / to (destination) / according to", "Ich lerne das Wort „nach“.", "other"],
  ["der", "Nachbar", "noun", "neighbor (male)", "Das ist der Nachbar.", "people"],
  ["die", "Nachbarin", "noun", "neighbor (female)", "Das ist die Nachbarin.", "people"],
  ["", "nachdem", "other", "after / afterward (conjunction)", "Nachdem ich esse, lerne ich.", "other"],
  ["", "nachdenken", "verb", "to reflect / ponder / think over", "Ich möchte nachdenken.", "verb"],
  ["die", "Nachfrage", "noun", "demand / inquiry", "Das ist die Nachfrage.", "other"],
  ["", "nachher", "adverb", "afterwards / later", "Ich mache das nachher.", "adverb"],
  ["die", "Nachhilfe", "noun", "tutoring / remedial teaching", "Das ist die Nachhilfe.", "stationery"],
  ["die", "Nachricht", "noun", "news / message", "Das ist die Nachricht.", "other"],
  ["", "nachschlagen", "verb", "to look up (in a book/dictionary)", "Ich möchte nachschlagen.", "verb"],
  ["die", "Nachspeise", "noun", "dessert", "Das ist die Nachspeise.", "food"],
  ["", "nächst", "adjective", "next / nearest", "Das ist nächst.", "adjective"],
  ["der", "Nachteil", "noun", "disadvantage / drawback", "Das ist der Nachteil.", "other"],
  ["der", "Nachwuchs", "noun", "offspring / next generation / young talent", "Das ist der Nachwuchs.", "family"],
  ["die", "Nadel", "noun", "needle / pin", "Das ist die Nadel.", "clothing"],
  ["der", "Nagel", "noun", "nail (tool/anatomy)", "Das ist der Nagel.", "house"],
  ["", "nah", "adjective", "near / close", "Das ist nah.", "adjective"],
  ["die", "Nähe", "noun", "vicinity / proximity", "Das ist die Nähe.", "places"],
  ["", "nähen", "verb", "to sew / stitch", "Ich möchte nähen.", "verb"],
  ["", "sich nähern", "verb", "to approach / draw near", "Ich möchte sich nähern.", "verb"],
  ["das", "Nahrungsmittel", "noun", "foodstuff / food", "Das ist das Nahrungsmittel.", "food"],
  ["der", "Name", "noun", "name", "Mein Name ist Anna.", "other"],
  ["der", "Familienname", "noun", "surname / last name", "Das ist der Familienname.", "family"],
  ["der", "Vorname", "noun", "first name / given name", "Das ist der Vorname.", "other"],
  ["", "nämlich", "adverb", "namely / you see / for", "Ich mache das nämlich.", "adverb"],
  ["die", "Nase", "noun", "nose", "Meine Nase ist kalt.", "body"],
  ["", "nass", "adjective", "wet / soaked", "Das ist nass.", "adjective"],
  ["", "national", "adjective", "national", "Das ist national.", "adjective"],
  ["die", "Natur", "noun", "nature", "Das ist die Natur.", "other"],
  ["", "natürlich", "adjective", "natural / of course", "Das ist natürlich.", "adjective"],
  ["der", "Nebel", "noun", "fog / mist", "Das ist der Nebel.", "other"],
  ["", "neblig", "adjective", "foggy / misty", "Das ist neblig.", "adjective"],
  ["", "neben", "other", "beside / next to", "Der Stuhl steht neben dem Tisch.", "other"],
  ["", "nebenan", "adverb", "next door", "Ich mache das nebenan.", "house"],
  ["", "nebenbei", "adverb", "by the way / on the side", "Ich mache das nebenbei.", "adverb"],
  ["der", "Neffe", "noun", "nephew", "Das ist der Neffe.", "family"],
  ["", "negativ", "adjective", "negative", "Das ist negativ.", "adjective"],
  ["", "nennen", "verb", "to name / call", "Ich möchte nennen.", "verb"],
  ["der", "Nerv", "noun", "nerve", "Das ist der Nerv.", "body"],
  ["", "nervös", "adjective", "nervous", "Das ist nervös.", "adjective"],
  ["", "nett", "adjective", "nice / kind", "Das ist nett.", "adjective"],
  ["das", "Netz", "noun", "net / network / web", "Das ist das Netz.", "other"],
  ["das", "Netzwerk", "noun", "network", "Das ist das Netzwerk.", "electronics"],
  ["", "neu", "adjective", "new / fresh", "Das ist neu.", "adjective"],
  ["die", "Neuigkeit", "noun", "news item / novelty", "Das ist die Neuigkeit.", "other"],
  ["", "neugierig", "adjective", "curious / nosy", "Das ist neugierig.", "adjective"],
  ["", "neulich", "adverb", "recently / the other day", "Ich mache das neulich.", "adverb"],
  ["die", "Nichte", "noun", "niece", "Das ist die Nichte.", "family"],
  ["der", "Nichtraucher", "noun", "non-smoker", "Das ist der Nichtraucher.", "people"],
  ["", "niedrig", "adjective", "low", "Das ist niedrig.", "adjective"],
  ["", "niemand", "other", "nobody / no one", "Ich lerne das Wort „niemand“.", "people"],
  ["", "nirgends", "adverb", "nowhere", "Ich mache das nirgends.", "adverb"],
  ["", "nirgendwo", "adverb", "nowhere", "Ich mache das nirgendwo.", "adverb"],
  ["", "noch", "adverb", "still / yet / another", "Ich bin noch hier.", "adverb"],
  ["", "nochmal", "adverb", "again / once more", "Ich mache das nochmal.", "adverb"],
  ["", "normal", "adjective", "normal / standard", "Das ist normal.", "adjective"],
  ["", "normalerweise", "adverb", "normally / usually", "Ich mache das normalerweise.", "adverb"],
  ["die", "Notaufnahme", "noun", "emergency room", "Das ist die Notaufnahme.", "places"],
  ["der", "Notausgang", "noun", "emergency exit", "Das ist der Notausgang.", "places"],
  ["der", "Notfall", "noun", "emergency", "Das ist der Notfall.", "other"],
  ["der", "Notruf", "noun", "emergency call", "Das ist der Notruf.", "other"],
  ["die", "Note", "noun", "grade / musical note", "Das ist die Note.", "stationery"],
  ["", "notieren", "verb", "to note down / record", "Ich möchte notieren.", "verb"],
  ["", "nötig", "adjective", "necessary / required", "Das ist nötig.", "adjective"],
  ["die", "Notiz", "noun", "note / memo", "Das ist die Notiz.", "stationery"],
  ["", "notwendig", "adjective", "necessary / essential", "Das ist notwendig.", "adjective"],
  ["die", "Nudel", "noun", "noodle / pasta", "Das ist die Nudel.", "food"],
  ["die", "Nummer", "noun", "number", "Das ist die Nummer.", "other"],
  ["", "nun", "adverb", "now / well / then", "Ich mache das nun.", "adverb"],
  ["", "nur", "adverb", "only / just", "Ich habe nur zehn Euro.", "adverb"],
  ["", "nutzen", "verb", "to use / utilize / take advantage of", "Ich möchte nutzen.", "verb"],
  ["", "nützen", "verb", "to be of use / avail", "Ich möchte nützen.", "verb"],
  ["", "nützlich", "adjective", "useful / helpful", "Das ist nützlich.", "adjective"],
  ["", "ob", "other", "whether / if", "Ich weiß nicht, ob er kommt.", "other"],
  ["", "ober-", "adjective", "upper / top", "Das ist ober-.", "adjective"],
  ["das", "Obst", "noun", "fruit", "Das ist das Obst.", "food"],
  ["", "obwohl", "other", "although / even though", "Obwohl ich müde bin, lerne ich.", "other"],
  ["der", "Ofen", "noun", "oven / stove", "Das ist der Ofen.", "house"],
  ["", "offen", "adjective", "open / frank / unsettled", "Das ist offen.", "adjective"],
  ["", "öffentlich", "adjective", "public", "Das ist öffentlich.", "adjective"],
  ["die", "Öffentlichkeit", "noun", "the public", "Das ist die Öffentlichkeit.", "other"],
  ["", "veröffentlichen", "verb", "to publish", "Ich möchte veröffentlichen.", "verb"],
  ["", "offenbar", "adverb", "apparently / obviously", "Ich mache das offenbar.", "adverb"],
  ["", "offiziell", "adjective", "official", "Das ist offiziell.", "adjective"],
  ["", "oft", "adverb", "often / frequently", "Ich lese oft.", "adverb"],
  ["das", "Ohr", "noun", "ear", "Das ist das Ohr.", "body"],
  ["das", "Öl", "noun", "oil", "Das ist das Öl.", "food"],
  ["die", "Oma", "noun", "grandma / grandmother", "Das ist die Oma.", "family"],
  ["der", "Onkel", "noun", "uncle", "Das ist der Onkel.", "family"],
  ["der", "Opa", "noun", "grandpa / grandfather", "Das ist der Opa.", "family"],
  ["die", "Oper", "noun", "opera / opera house", "Das ist die Oper.", "places"],
  ["", "operieren", "verb", "to operate / perform surgery", "Ich möchte operieren.", "verb"],
  ["die", "Operation", "noun", "operation / surgery", "Das ist die Operation.", "body"],
  ["das", "Opfer", "noun", "victim / casualty / sacrifice", "Das ist das Opfer.", "other"],
  ["", "optimistisch", "adjective", "optimistic", "Das ist optimistisch.", "adjective"],
  ["die", "Orange", "noun", "orange (fruit)", "Das ist die Orange.", "food"],
  ["das", "Orchester", "noun", "orchestra", "Das ist das Orchester.", "other"],
  ["", "ordentlich", "adjective", "tidy / orderly / neat", "Das ist ordentlich.", "adjective"],
  ["", "ordnen", "verb", "to arrange / organize", "Ich möchte ordnen.", "verb"],
  ["der", "Ordner", "noun", "folder / binder", "Das ist der Ordner.", "stationery"],
  ["die", "Ordnung", "noun", "order / neatness / rules", "Das ist die Ordnung.", "other"],
  ["", "organisieren", "verb", "to organize / arrange", "Ich möchte organisieren.", "verb"],
  ["die", "Organisation", "noun", "organization", "Das ist die Organisation.", "other"],
  ["das", "Original", "noun", "original", "Das ist das Original.", "stationery"],
  ["der", "Ort", "noun", "place / location / town", "Das ist der Ort.", "places"],
  ["der", "Vorort", "noun", "suburb", "Das ist der Vorort.", "places"],
  ["der", "Wohnort", "noun", "place of residence", "Das ist der Wohnort.", "places"],
  ["der", "Ozean", "noun", "ocean", "Das ist der Ozean.", "places"],
  ["", "ein paar", "other", "a few / a couple of", "Ich lerne das Wort „ein paar“.", "other"],
  ["das", "Paar", "noun", "pair / couple", "Das ist das Paar.", "people"],
  ["", "packen", "verb", "to pack / grab", "Ich möchte packen.", "verb"],
  ["das", "Paket", "noun", "parcel / package", "Das ist das Paket.", "other"],
  ["die", "Panne", "noun", "breakdown / mishap", "Das ist die Panne.", "transport"],
  ["das", "Papier", "noun", "paper / document", "Das ist das Papier.", "stationery"],
  ["", "parallel", "adjective", "parallel", "Das ist parallel.", "adjective"],
  ["das", "Parfüm", "noun", "perfume / fragrance", "Das ist das Parfüm.", "other"],
  ["der", "Park", "noun", "park", "Das ist der Park.", "places"],
  ["", "parken", "verb", "to park", "Ich möchte parken.", "verb"],
  ["der", "Partner", "noun", "partner / companion (male)", "Das ist der Partner.", "people"],
  ["die", "Partnerin", "noun", "partner / companion (female)", "Das ist die Partnerin.", "people"],
  ["die", "Party", "noun", "party", "Das ist die Party.", "other"],
  ["der", "Pass", "noun", "passport", "Das ist der Pass.", "other"],
  ["der", "Passagier", "noun", "passenger", "Das ist der Passagier.", "people"],
  ["", "passen", "verb", "to fit / suit / match", "Ich möchte passen.", "verb"],
  ["", "passieren", "verb", "to happen / occur", "Ich möchte passieren.", "verb"],
  ["", "passiv", "adjective", "passive", "Das ist passiv.", "adjective"],
  ["der", "Patient", "noun", "patient (male)", "Das ist der Patient.", "people"],
  ["die", "Patientin", "noun", "patient (female)", "Das ist die Patientin.", "people"],
  ["", "pauschal", "adjective", "all-inclusive / flat-rate", "Das ist pauschal.", "adjective"],
  ["die", "Pause", "noun", "break / intermission", "Ich mache eine Pause.", "time"],
  ["das", "Pech", "noun", "bad luck / misfortune", "Das ist das Pech.", "other"],
  ["", "peinlich", "adjective", "embarrassing / awkward", "Das ist peinlich.", "adjective"],
  ["die", "Pension", "noun", "guest house / retirement pension", "Das ist die Pension.", "places"],
  ["", "pensioniert", "adjective", "retired", "Das ist pensioniert.", "adjective"],
  ["", "per", "other", "by / via / per", "Ich lerne das Wort „per“.", "other"],
  ["", "perfekt", "adjective", "perfect / flawless", "Das ist perfekt.", "adjective"],
  ["die", "Person", "noun", "person", "Das ist die Person.", "people"],
  ["", "persönlich", "adjective", "personal / in person", "Das ist persönlich.", "adjective"],
  ["das", "Personal", "noun", "staff / personnel", "Das ist das Personal.", "people"],
  ["der", "Pfeffer", "noun", "pepper", "Das ist der Pfeffer.", "food"],
  ["", "pflanzen", "verb", "to plant", "Ich möchte pflanzen.", "verb"],
  ["die", "Pflanze", "noun", "plant", "Das ist die Pflanze.", "other"],
  ["das", "Pflaster", "noun", "band-aid / plaster / paving", "Das ist das Pflaster.", "body"],
  ["die", "Pflaume", "noun", "plum", "Das ist die Pflaume.", "food"],
  ["", "pflegen", "verb", "to care for / nurse / maintain", "Ich möchte pflegen.", "verb"],
  ["der", "Pfleger", "noun", "carer / nurse", "Das ist der Pfleger.", "professions"],
  ["die", "Pflicht", "noun", "duty / obligation", "Das ist die Pflicht.", "other"],
  ["das", "Picknick", "noun", "picnic", "Das ist das Picknick.", "food"],
  ["die", "Pille", "noun", "pill / tablet", "Das ist die Pille.", "body"],
  ["der", "Pilz", "noun", "mushroom", "Das ist der Pilz.", "food"],
  ["die", "Pizza", "noun", "pizza", "Das ist die Pizza.", "food"],
  ["das", "Plakat", "noun", "poster / placard", "Das ist das Plakat.", "stationery"],
  ["", "planen", "verb", "to plan", "Ich möchte planen.", "verb"],
  ["der", "Plan", "noun", "plan / map", "Das ist der Plan.", "other"],
  ["die", "Planung", "noun", "planning", "Das ist die Planung.", "other"],
  ["das", "Plastik", "noun", "plastic", "Das ist das Plastik.", "other"],
  ["der", "Platz", "noun", "place / square / seat / room", "Das ist der Platz.", "places"],
  ["", "plötzlich", "adverb", "suddenly / all of a sudden", "Ich mache das plötzlich.", "adverb"],
  ["die", "Politik", "noun", "politics / policy", "Das ist die Politik.", "other"],
  ["der", "Politiker", "noun", "politician (male)", "Das ist der Politiker.", "professions"],
  ["die", "Politikerin", "noun", "politician (female)", "Das ist die Politikerin.", "professions"],
  ["", "politisch", "adjective", "political", "Das ist politisch.", "adjective"],
  ["die", "Polizei", "noun", "police", "Das ist die Polizei.", "professions"],
  ["der", "Polizist", "noun", "police officer", "Das ist der Polizist.", "professions"],
  ["die", "Pommes frites", "noun", "French fries / chips", "Das sind die Pommes frites.", "food"],
  ["", "populär", "adjective", "popular", "Das ist populär.", "adjective"],
  ["die", "Portion", "noun", "portion / serving", "Das ist die Portion.", "food"],
  ["", "positiv", "adjective", "positive", "Das ist positiv.", "adjective"],
  ["die", "Post", "noun", "post / mail / post office", "Das ist die Post.", "places"],
  ["die", "Postleitzahl", "noun", "postcode / ZIP code", "Das ist die Postleitzahl.", "places"],
  ["das", "Praktikum", "noun", "internship / work placement", "Das ist das Praktikum.", "professions"],
  ["der", "Praktikant", "noun", "intern / trainee", "Das ist der Praktikant.", "professions"],
  ["", "praktisch", "adjective", "practical / handy / virtually", "Das ist praktisch.", "adjective"],
  ["die", "Präsentation", "noun", "presentation", "Das ist die Präsentation.", "stationery"],
  ["", "präsentieren", "verb", "to present / showcase", "Ich möchte präsentieren.", "verb"],
  ["die", "Praxis", "noun", "doctor's practice / practical application", "Das ist die Praxis.", "places"],
  ["der", "Preis", "noun", "price / award / prize", "Das ist der Preis.", "other"],
  ["", "preiswert", "adjective", "inexpensive / good value", "Das ist preiswert.", "adjective"],
  ["die", "Presse", "noun", "press / media", "Das ist die Presse.", "other"],
  ["", "prima", "adjective", "great / fine / fantastic", "Das ist prima.", "adjective"],
  ["", "privat", "adjective", "private / confidential", "Das ist privat.", "adjective"],
  ["", "pro", "other", "per", "Ich lerne das Wort „pro“.", "other"],
  ["", "probieren", "verb", "to try / taste / sample", "Ich möchte probieren.", "verb"],
  ["das", "Problem", "noun", "problem / issue", "Das ist ein Problem.", "other"],
  ["", "produzieren", "verb", "to produce / manufacture", "Ich möchte produzieren.", "verb"],
  ["das", "Produkt", "noun", "product", "Das ist das Produkt.", "other"],
  ["die", "Produktion", "noun", "production / manufacturing", "Das ist die Produktion.", "other"],
  ["der", "Professor", "noun", "professor", "Das ist der Professor.", "professions"],
  ["der", "Profi", "noun", "professional / expert", "Das ist der Profi.", "professions"],
  ["das", "Programm", "noun", "program / schedule / software", "Das ist das Programm.", "electronics"],
  ["das", "Projekt", "noun", "project", "Das ist das Projekt.", "other"],
  ["der", "Prospekt", "noun", "brochure / flyer", "Das ist der Prospekt.", "stationery"],
  ["", "protestieren", "verb", "to protest", "Ich möchte protestieren.", "verb"],
  ["der", "Protest", "noun", "protest", "Das ist der Protest.", "other"],
  ["der", "Prozess", "noun", "process / trial (law)", "Das ist der Prozess.", "other"],
  ["", "prüfen", "verb", "to check / examine / test", "Ich möchte prüfen.", "verb"],
  ["die", "Prüfung", "noun", "exam / test / examination", "Das ist die Prüfung.", "stationery"],
  ["das", "Publikum", "noun", "audience / public", "Das ist das Publikum.", "people"],
  ["der", "Pullover", "noun", "sweater / jumper / pullover", "Ich trage einen Pullover.", "clothing"],
  ["der", "Punkt", "noun", "dot / point / period (full stop)", "Das ist der Punkt.", "other"],
  ["die", "Puppe", "noun", "doll / puppet", "Das ist die Puppe.", "other"],
  ["", "putzen", "verb", "to clean / brush (teeth)", "Ich möchte putzen.", "verb"],
  ["die", "Qualifikation", "noun", "qualification / skill", "Das ist die Qualifikation.", "professions"],
  ["die", "Qualität", "noun", "quality", "Das ist die Qualität.", "other"],
  ["das", "Quartier", "noun", "neighborhood / quarter / lodging", "Das ist das Quartier.", "places"],
  ["", "quer", "adverb", "across / diagonally", "Ich mache das quer.", "adverb"],
  ["die", "Quittung", "noun", "receipt / slip", "Das ist die Quittung.", "stationery"],
  ["das", "Quiz", "noun", "quiz / trivia game", "Das ist das Quiz.", "other"],
  ["der", "Rabatt", "noun", "discount / rebate", "Das ist der Rabatt.", "other"],
  ["das", "Rad", "noun", "wheel / bicycle", "Das ist das Rad.", "transport"],
  ["der", "Radfahrer", "noun", "cyclist (male)", "Das ist der Radfahrer.", "people"],
  ["die", "Radfahrerin", "noun", "cyclist (female)", "Das ist die Radfahrerin.", "people"],
  ["das", "Radio", "noun", "radio", "Das Radio ist an.", "electronics"],
  ["der", "Rand", "noun", "edge / border / rim", "Das ist der Rand.", "places"],
  ["der", "Rasen", "noun", "lawn / grass", "Das ist der Rasen.", "house"],
  ["", "sich rasieren", "verb", "to shave (oneself)", "Ich möchte sich rasieren.", "verb"],
  ["", "raten", "verb", "to advise / guess", "Ich möchte raten.", "verb"],
  ["der", "Rat", "noun", "advice / counsel", "Das ist der Rat.", "other"],
  ["der", "Ratschlag", "noun", "piece of advice / suggestion", "Das ist der Ratschlag.", "other"],
  ["das", "Rätsel", "noun", "riddle / puzzle", "Das ist das Rätsel.", "other"],
  ["das", "Rathaus", "noun", "town hall / city hall", "Das ist das Rathaus.", "places"],
  ["der", "Raucher", "noun", "smoker (male)", "Das ist der Raucher.", "people"],
  ["die", "Raucherin", "noun", "smoker (female)", "Das ist die Raucherin.", "people"],
  ["der", "Raum", "noun", "room / space", "Das ist der Raum.", "house"],
  ["", "rauf", "adverb", "up / upwards", "Ich mache das rauf.", "adverb"],
  ["", "raus", "adverb", "out / outside", "Ich mache das raus.", "adverb"],
  ["", "reagieren", "verb", "to react / respond", "Ich möchte reagieren.", "verb"],
  ["die", "Reaktion", "noun", "reaction / response", "Das ist die Reaktion.", "other"],
  ["", "realisieren", "verb", "to realize / implement", "Ich möchte realisieren.", "verb"],
  ["die", "Realität", "noun", "reality", "Das ist die Realität.", "other"],
  ["", "realistisch", "adjective", "realistic", "Das ist realistisch.", "adjective"],
  ["die", "Recherche", "noun", "research / investigation", "Das ist die Recherche.", "stationery"],
  ["", "rechnen", "verb", "to calculate / reckon / count on", "Ich möchte rechnen.", "verb"],
  ["der", "Rechner", "noun", "calculator / computer", "Das ist der Rechner.", "electronics"],
  ["die", "Rechnung", "noun", "bill / invoice / calculation", "Das ist die Rechnung.", "other"],
  ["das", "Recht", "noun", "right / law / justice", "Das ist das Recht.", "other"],
  ["", "rechtlich", "adjective", "legal / statutory", "Das ist rechtlich.", "adjective"],
  ["", "recht", "adjective", "right / correct / appropriate", "Das ist recht.", "adjective"],
  ["", "rechts", "adverb", "to the right / on the right", "Gehen Sie rechts.", "places"],
  ["", "rechtzeitig", "adjective", "on time / in good time", "Das ist rechtzeitig.", "adjective"],
  ["", "reden", "verb", "to talk / speak", "Ich möchte reden.", "verb"],
  ["die", "Rede", "noun", "speech / talk", "Das ist die Rede.", "other"],
  ["", "reduzieren", "verb", "to reduce / cut down", "Ich möchte reduzieren.", "verb"],
  ["das", "Referat", "noun", "presentation / report", "Das ist das Referat.", "stationery"],
  ["die", "Reform", "noun", "reform", "Das ist die Reform.", "other"],
  ["das", "Regal", "noun", "shelf / bookcase", "Das ist das Regal.", "furniture"],
  ["die", "Regel", "noun", "rule / regulation", "Das ist die Regel.", "other"],
  ["", "regelmäßig", "adjective", "regular / regularly", "Das ist regelmäßig.", "adjective"],
  ["", "regeln", "verb", "to regulate / settle / control", "Ich möchte regeln.", "verb"],
  ["der", "Regen", "noun", "rain", "Das ist der Regen.", "other"],
  ["die", "Region", "noun", "region / area", "Das ist die Region.", "places"],
  ["", "regional", "adjective", "regional / local", "Das ist regional.", "adjective"],
  ["", "reich", "adjective", "rich / wealthy", "Das ist reich.", "adjective"],
  ["", "reichen", "verb", "to be enough / reach / pass", "Ich möchte reichen.", "verb"],
  ["", "reif", "adjective", "ripe / mature", "Das ist reif.", "adjective"],
  ["der", "Reifen", "noun", "tyre / tire", "Das ist der Reifen.", "transport"],
  ["die", "Reihe", "noun", "row / turn", "Das ist die Reihe.", "other"],
  ["die", "Reihenfolge", "noun", "order / sequence", "Das ist die Reihenfolge.", "other"],
  ["", "rein", "adjective", "pure / clean", "Das ist rein.", "adjective"],
  ["", "reinigen", "verb", "to clean / dry-clean", "Ich möchte reinigen.", "verb"],
  ["die", "Reinigung", "noun", "cleaning / dry cleaner's", "Das ist die Reinigung.", "places"],
  ["der", "Reis", "noun", "rice", "Das ist der Reis.", "food"],
  ["die", "Reise", "noun", "journey / trip / voyage", "Das ist die Reise.", "places"],
  ["das", "Reisebüro", "noun", "travel agency", "Das ist das Reisebüro.", "places"],
  ["der", "Reiseführer", "noun", "travel guide (person/book)", "Das ist der Reiseführer.", "stationery"],
  ["", "reiten", "verb", "to ride (horse)", "Ich möchte reiten.", "verb"],
  ["die", "Reklame", "noun", "advertisement / commercial", "Das ist die Reklame.", "other"],
  ["der", "Rekord", "noun", "record (sports)", "Das ist der Rekord.", "other"],
  ["", "relativ", "adjective", "relative / relatively", "Das ist relativ.", "adjective"],
  ["die", "Religion", "noun", "religion", "Das ist die Religion.", "other"],
  ["", "rennen", "verb", "to run / race", "Ich möchte rennen.", "verb"],
  ["die", "Rente", "noun", "pension / retirement", "Das ist die Rente.", "professions"],
  ["der", "Rentner", "noun", "pensioner / retiree (male)", "Das ist der Rentner.", "people"],
  ["die", "Rentnerin", "noun", "pensioner / retiree (female)", "Das ist die Rentnerin.", "people"],
  ["", "reparieren", "verb", "to repair / fix", "Ich repariere das Fahrrad.", "verb"],
  ["die", "Reparatur", "noun", "repair", "Das ist die Reparatur.", "other"],
  ["die", "Reportage", "noun", "reportage / feature / report", "Das ist die Reportage.", "stationery"],
  ["der", "Reporter", "noun", "reporter / journalist", "Das ist der Reporter.", "professions"],
  ["", "reservieren", "verb", "to reserve / book", "Ich möchte reservieren.", "verb"],
  ["die", "Reservierung", "noun", "reservation / booking", "Das ist die Reservierung.", "other"],
  ["der", "Respekt", "noun", "respect", "Das ist der Respekt.", "other"],
  ["der", "Rest", "noun", "rest / remainder / leftovers", "Das ist der Rest.", "other"],
  ["das", "Restaurant", "noun", "restaurant", "Das Restaurant ist gut.", "places"],
  ["", "retten", "verb", "to save / rescue", "Ich möchte retten.", "verb"],
  ["das", "Rezept", "noun", "recipe / prescription", "Das ist das Rezept.", "body"],
  ["die", "Rezeption", "noun", "reception desk", "Das ist die Rezeption.", "places"],
  ["der", "Richter", "noun", "judge (male)", "Das ist der Richter.", "professions"],
  ["die", "Richterin", "noun", "judge (female)", "Das ist die Richterin.", "professions"],
  ["", "richtig", "adjective", "right / correct / proper", "Das ist richtig.", "adjective"],
  ["die", "Richtung", "noun", "direction", "Das ist die Richtung.", "transport"],
  ["", "riechen", "verb", "to smell / scent", "Die Blume riecht gut.", "verb"],
  ["", "riesig", "adjective", "huge / gigantic / enormous", "Das ist riesig.", "adjective"],
  ["das", "Rind", "noun", "cattle / beef", "Das ist das Rind.", "food"],
  ["der", "Ring", "noun", "ring", "Das ist der Ring.", "other"],
  ["das", "Risiko", "noun", "risk", "Das ist das Risiko.", "other"],
  ["der", "Rock", "noun", "skirt", "Das ist der Rock.", "clothing"],
  ["", "roh", "adjective", "raw / uncooked", "Das ist roh.", "adjective"],
  ["die", "Rolle", "noun", "role / roll / part", "Das ist die Rolle.", "other"],
  ["der", "Roman", "noun", "novel", "Das ist der Roman.", "stationery"],
  ["die", "Rose", "noun", "rose", "Das ist die Rose.", "other"],
  ["der", "Rucksack", "noun", "backpack / rucksack", "Das ist der Rucksack.", "transport"],
  ["die", "Rückfahrt", "noun", "return journey / return trip", "Das ist die Rückfahrt.", "transport"],
  ["die", "Rückkehr", "noun", "return / homecoming", "Das ist die Rückkehr.", "other"],
  ["", "rückwärts", "adverb", "backwards / in reverse", "Ich mache das rückwärts.", "adverb"],
  ["der", "Rücken", "noun", "back (anatomy)", "Das ist der Rücken.", "body"],
  ["die", "Rücksicht", "noun", "consideration / regard", "Das ist die Rücksicht.", "other"],
  ["", "rufen", "verb", "to call / shout", "Ich möchte rufen.", "verb"],
  ["die", "Rufnummer", "noun", "phone number", "Das ist die Rufnummer.", "other"],
  ["die", "Ruhe", "noun", "quiet / peace / rest", "Das ist die Ruhe.", "other"],
  ["", "ruhig", "adjective", "quiet / calm / peaceful", "Das ist ruhig.", "adjective"],
  ["", "rund", "adjective", "round / approximately", "Das ist rund.", "adjective"],
  ["die", "Runde", "noun", "round / lap", "Das ist die Runde.", "other"],
  ["die", "Rundfahrt", "noun", "sightseeing tour / round trip", "Das ist die Rundfahrt.", "places"],
  ["der", "Saal", "noun", "hall / large room", "Das ist der Saal.", "places"],
  ["die", "Sache", "noun", "thing / matter / item", "Das ist die Sache.", "other"],
  ["der", "Sack", "noun", "sack / bag", "Das ist der Sack.", "other"],
  ["der", "Saft", "noun", "juice", "Ich trinke Saft.", "food"],
  ["", "sagen", "verb", "to say / tell", "Ich möchte sagen.", "verb"],
  ["die", "Sahne", "noun", "cream / whipped cream", "Das ist die Sahne.", "food"],
  ["die", "Saison", "noun", "season (peak/sports)", "Das ist die Saison.", "time"],
  ["der", "Salat", "noun", "salad / lettuce", "Das ist der Salat.", "food"],
  ["die", "Salbe", "noun", "ointment / salve", "Das ist die Salbe.", "body"],
  ["der", "Salon", "noun", "salon / parlour", "Das ist der Salon.", "places"],
  ["das", "Salz", "noun", "salt", "Ich brauche Salz.", "food"],
  ["", "salzig", "adjective", "salty", "Das ist salzig.", "adjective"],
  ["", "sammeln", "verb", "to collect / gather", "Ich möchte sammeln.", "verb"],
  ["", "sämtlich", "adjective", "all / entire", "Das ist sämtlich.", "adjective"],
  ["der", "Sand", "noun", "sand", "Das ist der Sand.", "other"],
  ["der", "Sänger", "noun", "singer (male)", "Das ist der Sänger.", "professions"],
  ["die", "Sängerin", "noun", "singer (female)", "Das ist die Sängerin.", "professions"],
  ["", "satt", "adjective", "full / satisfied (food)", "Das ist satt.", "adjective"],
  ["der", "Satz", "noun", "sentence", "Das ist der Satz.", "stationery"],
  ["", "sauber", "adjective", "clean / tidy", "Das ist sauber.", "adjective"],
  ["", "sauer", "adjective", "sour / angry", "Das ist sauer.", "adjective"],
  ["die", "Schachtel", "noun", "box / packet", "Das ist die Schachtel.", "other"],
  ["", "schade", "adjective", "a pity / shame", "Das ist schade.", "adjective"],
  ["", "schaden", "verb", "to harm / damage", "Ich möchte schaden.", "verb"],
  ["der", "Schaden", "noun", "damage / loss", "Das ist der Schaden.", "other"],
  ["", "schädlich", "adjective", "harmful / damaging", "Das ist schädlich.", "adjective"],
  ["", "schaffen", "verb", "to manage / create / accomplish", "Ich möchte schaffen.", "verb"],
  ["", "schalten", "verb", "to switch / change gears", "Ich möchte schalten.", "verb"],
  ["der", "Schalter", "noun", "counter / switch", "Das ist der Schalter.", "places"],
  ["", "scharf", "adjective", "sharp / spicy / hot", "Das ist scharf.", "adjective"],
  ["der", "Schatten", "noun", "shadow / shade", "Das ist der Schatten.", "other"],
  ["", "schätzen", "verb", "to estimate / appreciate / value", "Ich möchte schätzen.", "verb"],
  ["", "schauen", "verb", "to look / watch", "Ich möchte schauen.", "verb"],
  ["das", "Schaufenster", "noun", "shop window / display window", "Das ist das Schaufenster.", "places"],
  ["der", "Schauspieler", "noun", "actor", "Das ist der Schauspieler.", "professions"],
  ["die", "Schauspielerin", "noun", "actress", "Das ist die Schauspielerin.", "professions"],
  ["die", "Scheibe", "noun", "slice / pane of glass", "Das ist die Scheibe.", "food"],
  ["", "sich scheiden lassen", "verb", "to get divorced", "Ich möchte sich scheiden lassen.", "verb"],
  ["die", "Scheidung", "noun", "divorce", "Das ist die Scheidung.", "family"],
  ["der", "Schein", "noun", "banknote / certificate / slip", "Das ist der Schein.", "other"],
  ["", "scheinen", "verb", "to shine / seem / appear", "Ich möchte scheinen.", "verb"],
  ["", "schenken", "verb", "to give (as a present) / gift", "Ich möchte schenken.", "verb"],
  ["die", "Schere", "noun", "scissors", "Das ist die Schere.", "stationery"],
  ["", "schicken", "verb", "to send / dispatch", "Ich schicke eine E-Mail.", "verb"],
  ["", "schieben", "verb", "to push / shove", "Ich möchte schieben.", "verb"],
  ["", "schief", "adjective", "crooked / lopsided", "Das ist schief.", "adjective"],
  ["", "schießen", "verb", "to shoot / score", "Ich möchte schießen.", "verb"],
  ["das", "Schiff", "noun", "ship / boat", "Das ist das Schiff.", "transport"],
  ["das", "Schild", "noun", "sign / signboard / badge", "Das ist das Schild.", "places"],
  ["der", "Schinken", "noun", "ham", "Das ist der Schinken.", "food"],
  ["", "schimpfen", "verb", "to scold / grumble", "Ich möchte schimpfen.", "verb"],
  ["der", "Schlaf", "noun", "sleep", "Das ist der Schlaf.", "other"],
  ["", "schlagen", "verb", "to hit / beat / defeat", "Ich möchte schlagen.", "verb"],
  ["", "schlecht", "adjective", "bad / poor / rotten", "Das ist schlecht.", "adjective"],
  ["", "schließen", "verb", "to close / shut / conclude", "Ich schließe das Fenster.", "verb"],
  ["der", "Schluss", "noun", "end / conclusion", "Das ist der Schluss.", "other"],
  ["der", "Schlüssel", "noun", "key", "Das ist der Schlüssel.", "house"],
  ["", "schmal", "adjective", "narrow / slim", "Das ist schmal.", "adjective"],
  ["", "schmecken", "verb", "to taste / be tasty", "Die Suppe schmeckt gut.", "verb"],
  ["der", "Schmerz", "noun", "pain / ache", "Das ist der Schmerz.", "body"],
  ["das", "Schmerzmittel", "noun", "painkiller / pain reliever", "Das ist das Schmerzmittel.", "body"],
  ["", "schminken", "verb", "to put on makeup", "Ich möchte schminken.", "verb"],
  ["der", "Schmuck", "noun", "jewellery / jewelry", "Das ist der Schmuck.", "other"],
  ["der", "Schmutz", "noun", "dirt / filth", "Das ist der Schmutz.", "other"],
  ["", "schmutzig", "adjective", "dirty / soiled", "Das ist schmutzig.", "adjective"],
  ["der", "Schnee", "noun", "snow", "Das ist der Schnee.", "other"],
  ["", "schneien", "verb", "to snow", "Ich möchte schneien.", "verb"],
  ["", "schneiden", "verb", "to cut / slice", "Ich schneide das Brot.", "verb"],
  ["das", "Schnitzel", "noun", "schnitzel / cutlet", "Das ist das Schnitzel.", "food"],
  ["der", "Schnupfen", "noun", "cold / runny nose / rhinitis", "Das ist der Schnupfen.", "body"],
  ["die", "Schokolade", "noun", "chocolate", "Ich esse Schokolade.", "food"],
  ["", "schon", "adverb", "already / indeed", "Ich bin schon fertig.", "adverb"],
  ["", "schön", "adjective", "beautiful / nice / lovely", "Das Wetter ist schön.", "adjective"],
  ["der", "Schrank", "noun", "cupboard / wardrobe / closet", "Das ist der Schrank.", "furniture"],
  ["der", "Schreck", "noun", "fright / shock", "Das ist der Schreck.", "other"],
  ["", "schrecklich", "adjective", "terrible / awful / dreadful", "Das ist schrecklich.", "adjective"],
  ["das", "Schreiben", "noun", "letter / official document", "Das ist das Schreiben.", "stationery"],
  ["", "schreien", "verb", "to scream / shout", "Ich möchte schreien.", "verb"],
  ["die", "Schrift", "noun", "handwriting / script / font", "Das ist die Schrift.", "stationery"],
  ["", "schriftlich", "adjective", "in writing / written", "Das ist schriftlich.", "adjective"],
  ["der", "Schriftsteller", "noun", "writer / author (male)", "Das ist der Schriftsteller.", "professions"],
  ["die", "Schriftstellerin", "noun", "writer / author (female)", "Das ist die Schriftstellerin.", "professions"],
  ["der", "Schritt", "noun", "step / pace", "Das ist der Schritt.", "other"],
  ["der", "Schuh", "noun", "shoe", "Das ist der Schuh.", "clothing"],
  ["die", "Schuld", "noun", "fault / guilt / blame", "Das ist die Schuld.", "other"],
  ["", "schuld", "adjective", "to blame / at fault", "Das ist schuld.", "adjective"],
  ["die", "Schulden", "noun", "debts", "Das ist die Schulden.", "other"],
  ["", "schuldig", "adjective", "guilty / owing", "Das ist schuldig.", "adjective"],
  ["die", "Schule", "noun", "school", "Die Schule ist hier.", "places"],
  ["der", "Schüler", "noun", "pupil / student (male)", "Das ist der Schüler.", "people"],
  ["die", "Schülerin", "noun", "pupil / student (female)", "Das ist die Schülerin.", "people"],
  ["die", "Schulter", "noun", "shoulder", "Das ist die Schulter.", "body"],
  ["die", "Schüssel", "noun", "bowl / dish", "Das ist die Schüssel.", "tableware"],
  ["", "schütteln", "verb", "to shake", "Ich möchte schütteln.", "verb"],
  ["", "schützen", "verb", "to protect / guard", "Ich möchte schützen.", "verb"],
  ["der", "Schutz", "noun", "protection / shelter", "Das ist der Schutz.", "other"],
  ["", "schwach", "adjective", "weak / feeble / faint", "Das ist schwach.", "adjective"],
  ["", "schwanger", "adjective", "pregnant", "Das ist schwanger.", "family"],
  ["die", "Schwangerschaft", "noun", "pregnancy", "Das ist die Schwangerschaft.", "body"],
  ["", "schweigen", "verb", "to remain silent / be silent", "Ich möchte schweigen.", "verb"],
  ["", "schwer", "adjective", "heavy / difficult / hard", "Das ist schwer.", "adjective"],
  ["die", "Schwester", "noun", "sister", "Das ist meine Schwester.", "family"],
  ["", "schwierig", "adjective", "difficult / hard", "Die Aufgabe ist schwierig.", "adjective"],
  ["die", "Schwierigkeit", "noun", "difficulty / trouble", "Das ist die Schwierigkeit.", "other"],
  ["das", "Schwimmbad", "noun", "swimming pool", "Das ist das Schwimmbad.", "places"],
  ["der", "See", "noun", "lake", "Das ist der See.", "places"],
  ["die", "See", "noun", "sea / ocean", "Das ist die See.", "places"],
  ["", "sehen", "verb", "to see / look / watch", "Ich sehe einen Film.", "verb"],
  ["die", "Sehenswürdigkeit", "noun", "tourist sight / attraction", "Das ist die Sehenswürdigkeit.", "places"],
  ["", "sehr", "adverb", "very / much / highly", "Ich mache das sehr.", "adverb"],
  ["die", "Seife", "noun", "soap", "Das ist die Seife.", "house"],
  ["", "seit", "other", "since / for (time)", "Ich lerne seit einem Jahr Deutsch.", "other"],
  ["", "seitdem", "other", "since then", "Ich lerne das Wort „seitdem“.", "other"],
  ["die", "Seite", "noun", "page / side", "Das ist die Seite.", "stationery"],
  ["der", "Sekretär", "noun", "secretary (male)", "Das ist der Sekretär.", "professions"],
  ["die", "Sekretärin", "noun", "secretary (female)", "Das ist die Sekretärin.", "professions"],
  ["", "selbst", "other", "myself / yourself / even", "Ich lerne das Wort „selbst“.", "other"],
  ["", "selbstverständlich", "adjective", "self-evident / of course", "Das ist selbstverständlich.", "adjective"],
  ["", "selten", "adverb", "rarely / seldom", "Ich mache das selten.", "adverb"],
  ["", "seltsam", "adjective", "strange / peculiar / odd", "Das ist seltsam.", "adjective"],
  ["das", "Semester", "noun", "semester / term", "Das ist das Semester.", "stationery"],
  ["das", "Seminar", "noun", "seminar / workshop", "Das ist das Seminar.", "stationery"],
  ["", "senden", "verb", "to send / broadcast", "Ich möchte senden.", "verb"],
  ["der", "Sender", "noun", "broadcasting station / channel", "Das ist der Sender.", "electronics"],
  ["die", "Sendung", "noun", "programme / show / consignment", "Das ist die Sendung.", "other"],
  ["die", "Senioren", "noun", "senior citizens / elderly", "Das ist die Senioren.", "people"],
  ["", "senkrecht", "adjective", "vertical / perpendicular", "Das ist senkrecht.", "adjective"],
  ["die", "Serie", "noun", "series / TV show", "Das ist die Serie.", "other"],
  ["der", "Service", "noun", "service / customer care", "Das ist der Service.", "other"],
  ["der", "Sessel", "noun", "armchair", "Das ist der Sessel.", "furniture"],
  ["", "sich setzen", "verb", "to sit down / take a seat", "Ich möchte sich setzen.", "verb"],
  ["", "sicher", "adjective", "safe / sure / secure", "Das ist sicher.", "adjective"],
  ["die", "Sicherheit", "noun", "security / safety", "Das ist die Sicherheit.", "other"],
  ["", "sichern", "verb", "to save (data) / secure", "Ich möchte sichern.", "verb"],
  ["", "sichtbar", "adjective", "visible", "Das ist sichtbar.", "adjective"],
  ["", "siegen", "verb", "to win / triumph", "Ich möchte siegen.", "verb"],
  ["der", "Sieg", "noun", "victory / triumph", "Das ist der Sieg.", "other"],
  ["der", "Sieger", "noun", "winner / champion", "Das ist der Sieger.", "people"],
  ["", "siezen", "verb", "to address formally (Sie)", "Ich möchte siezen.", "verb"],
  ["", "sinken", "verb", "to sink / fall / decrease", "Ich möchte sinken.", "verb"],
  ["der", "Sinn", "noun", "sense / meaning / purpose", "Das ist der Sinn.", "other"],
  ["", "sinnlos", "adjective", "senseless / pointless", "Das ist sinnlos.", "adjective"],
  ["", "sinnvoll", "adjective", "meaningful / useful / sensible", "Das ist sinnvoll.", "adjective"],
  ["die", "Situation", "noun", "situation / state of affairs", "Das ist die Situation.", "other"],
  ["der", "Sitz", "noun", "seat / headquarters", "Das ist der Sitz.", "furniture"],
  ["", "so", "adverb", "so / thus / like this", "Ich mache das so.", "adverb"],
  ["", "sobald", "other", "as soon as", "Ich lerne das Wort „sobald“.", "other"],
  ["die", "Socke", "noun", "sock", "Das ist die Socke.", "clothing"],
  ["", "sodass", "other", "so that / with the result that", "Ich lerne das Wort „sodass“.", "other"],
  ["das", "Sofa", "noun", "sofa / couch", "Das ist ein Sofa.", "furniture"],
  ["", "sofort", "adverb", "immediately / right away", "Ich komme sofort.", "adverb"],
  ["der", "Sohn", "noun", "son", "Das ist mein Sohn.", "family"],
  ["", "solange", "other", "as long as", "Ich lerne das Wort „solange“.", "other"],
  ["", "solch-", "adjective", "such / of that kind", "Das ist solch-.", "adjective"],
  ["", "sondern", "other", "but (rather)", "Ich trinke keinen Kaffee, sondern Tee.", "other"],
  ["die", "Sonne", "noun", "sun", "Das ist die Sonne.", "other"],
  ["", "sonnig", "adjective", "sunny", "Das ist sonnig.", "adjective"],
  ["", "sonst", "adverb", "otherwise / besides / usually", "Beeil dich, sonst verpassen wir den Bus.", "adverb"],
  ["", "sorgen", "verb", "to take care of / ensure / worry", "Ich möchte sorgen.", "verb"],
  ["die", "Sorge", "noun", "worry / concern / care", "Das ist die Sorge.", "other"],
  ["die", "Soße", "noun", "sauce / gravy", "Das ist die Soße.", "food"],
  ["das", "Souvenir", "noun", "souvenir / keepsake", "Das ist das Souvenir.", "other"],
  ["", "sowohl ... als auch", "other", "both ... and / as well as", "Ich lerne das Wort „sowohl ... als auch“.", "other"],
  ["", "sozial", "adjective", "social", "Das ist sozial.", "adjective"],
  ["", "spannend", "adjective", "exciting / thrilling", "Das ist spannend.", "adjective"],
  ["", "sparen", "verb", "to save (money/energy)", "Ich möchte sparen.", "verb"],
  ["", "sparsam", "adjective", "economical / thrifty", "Das ist sparsam.", "adjective"],
  ["der", "Spaß", "noun", "fun / pleasure", "Das ist der Spaß.", "other"],
  ["", "spätestens", "adverb", "at the latest", "Ich mache das spätestens.", "adverb"],
  ["", "spazieren gehen", "verb", "to go for a walk", "Ich möchte spazieren gehen.", "verb"],
  ["der", "Spaziergang", "noun", "walk / stroll", "Das ist der Spaziergang.", "other"],
  ["", "speichern", "verb", "to save / store (data)", "Ich möchte speichern.", "verb"],
  ["die", "Speisekarte", "noun", "menu", "Das ist die Speisekarte.", "tableware"],
  ["der", "Spiegel", "noun", "mirror", "Das ist der Spiegel.", "house"],
  ["", "spielen", "verb", "to play / act", "Ich spiele Fußball.", "verb"],
  ["das", "Spiel", "noun", "game / match", "Das ist das Spiel.", "other"],
  ["der", "Spieler", "noun", "player (male)", "Das ist der Spieler.", "people"],
  ["die", "Spielerin", "noun", "player (female)", "Das ist die Spielerin.", "people"],
  ["der", "Spielplatz", "noun", "playground", "Das ist der Spielplatz.", "places"],
  ["das", "Spielzeug", "noun", "toy", "Das ist das Spielzeug.", "other"],
  ["", "spitz", "adjective", "pointed / sharp", "Das ist spitz.", "adjective"],
  ["der", "Sport", "noun", "sport / exercise", "Das ist der Sport.", "other"],
  ["die", "Sportart", "noun", "kind of sport", "Das ist die Sportart.", "other"],
  ["der", "Sportler", "noun", "sportsman / athlete", "Das ist der Sportler.", "people"],
  ["", "sportlich", "adjective", "sporty / athletic", "Das ist sportlich.", "adjective"],
  ["die", "Sprache", "noun", "language / speech", "Das ist die Sprache.", "other"],
  ["die", "Fremdsprache", "noun", "foreign language", "Das ist die Fremdsprache.", "other"],
  ["die", "Muttersprache", "noun", "mother tongue / native language", "Das ist die Muttersprache.", "other"],
  ["", "sprechen", "verb", "to speak / talk", "Ich spreche Deutsch.", "verb"],
  ["die", "Sprechstunde", "noun", "consulting hours / office hours", "Das ist die Sprechstunde.", "time"],
  ["", "springen", "verb", "to jump / leap", "Ich möchte springen.", "verb"],
  ["die", "Spritze", "noun", "injection / syringe", "Das ist die Spritze.", "body"],
  ["", "spülen", "verb", "to wash dishes / rinse", "Ich möchte spülen.", "verb"],
  ["die", "Spur", "noun", "track / lane / trace", "Das ist die Spur.", "transport"],
  ["", "spüren", "verb", "to feel / perceive", "Ich möchte spüren.", "verb"],
  ["das", "Stadion", "noun", "stadium", "Das ist das Stadion.", "places"],
  ["die", "Stadt", "noun", "city / town", "Das ist die Stadt.", "places"],
  ["der", "Stadtplan", "noun", "city map", "Das ist der Stadtplan.", "stationery"],
  ["", "stammen", "verb", "to originate / stem from", "Ich möchte stammen.", "verb"],
  ["", "ständig", "adjective", "constant / continuous / permanently", "Das ist ständig.", "adjective"],
  ["der", "Standpunkt", "noun", "point of view / standpoint", "Das ist der Standpunkt.", "other"],
  ["der", "Star", "noun", "star (celebrity)", "Das ist der Star.", "people"],
  ["", "stark", "adjective", "strong / powerful / heavy", "Das ist stark.", "adjective"],
  ["", "starten", "verb", "to start / take off", "Ich möchte starten.", "verb"],
  ["der", "Start", "noun", "start / take-off", "Das ist der Start.", "transport"],
  ["die", "Station", "noun", "station / ward (hospital)", "Das ist die Station.", "transport"],
  ["die", "Statistik", "noun", "statistics", "Das ist die Statistik.", "stationery"],
  ["", "statt", "other", "instead of", "Ich lerne das Wort „statt“.", "other"],
  ["", "stattfinden", "verb", "to take place / happen", "Ich möchte stattfinden.", "verb"],
  ["der", "Stau", "noun", "traffic jam", "Das ist der Stau.", "transport"],
  ["der", "Staub", "noun", "dust", "Das ist der Staub.", "house"],
  ["", "staubsaugen", "verb", "to vacuum / hoover", "Ich möchte staubsaugen.", "verb"],
  ["", "stechen", "verb", "to sting / prick / stab", "Ich möchte stechen.", "verb"],
  ["", "stecken", "verb", "to put / stick / be stuck", "Ich möchte stecken.", "verb"],
  ["die", "Steckdose", "noun", "socket / wall outlet", "Das ist die Steckdose.", "electronics"],
  ["der", "Stecker", "noun", "plug", "Das ist der Stecker.", "electronics"],
  ["", "stehen", "verb", "to stand / be located", "Ich möchte stehen.", "verb"],
  ["", "stehen bleiben", "verb", "to stop / come to a standstill", "Ich möchte stehen bleiben.", "verb"],
  ["", "stehlen", "verb", "to steal", "Ich möchte stehlen.", "verb"],
  ["", "steigen", "verb", "to climb / rise / increase", "Ich möchte steigen.", "verb"],
  ["", "steil", "adjective", "steep", "Das ist steil.", "adjective"],
  ["der", "Stein", "noun", "stone / rock", "Das ist der Stein.", "other"],
  ["die", "Stelle", "noun", "place / job / position", "Das ist die Stelle.", "professions"],
  ["", "stellen", "verb", "to place / put / set", "Ich möchte stellen.", "verb"],
  ["der", "Stempel", "noun", "stamp / postmark", "Das ist der Stempel.", "stationery"],
  ["", "sterben", "verb", "to die / pass away", "Ich möchte sterben.", "verb"],
  ["der", "Stern", "noun", "star", "Das ist der Stern.", "other"],
  ["die", "Steuer", "noun", "tax", "Das ist die Steuer.", "other"],
  ["der", "Stift", "noun", "pen / pencil / marker", "Das ist ein Stift.", "stationery"],
  ["", "still", "adjective", "quiet / silent / calm", "Das ist still.", "adjective"],
  ["der", "Stiefel", "noun", "boot", "Das ist der Stiefel.", "clothing"],
  ["die", "Stimme", "noun", "voice / vote", "Das ist die Stimme.", "body"],
  ["", "stimmen", "verb", "to be correct / tune", "Ich möchte stimmen.", "verb"],
  ["die", "Stimmung", "noun", "mood / atmosphere", "Das ist die Stimmung.", "other"],
  ["", "stinken", "verb", "to stink / smell bad", "Ich möchte stinken.", "verb"],
  ["der", "Stock", "noun", "floor / storey / stick", "Das ist der Stock.", "house"],
  ["das", "Stockwerk", "noun", "storey / floor", "Das ist das Stockwerk.", "house"],
  ["der", "Stoff", "noun", "fabric / material / substance", "Das ist der Stoff.", "other"],
  ["", "stolz", "adjective", "proud", "Das ist stolz.", "adjective"],
  ["", "stoppen", "verb", "to stop", "Ich möchte stoppen.", "verb"],
  ["", "stören", "verb", "to disturb / bother", "Ich möchte stören.", "verb"],
  ["die", "Störung", "noun", "disturbance / disruption / fault", "Das ist die Störung.", "other"],
  ["", "sich stoßen", "verb", "to bump / hit", "Ich möchte sich stoßen.", "verb"],
  ["die", "Strafe", "noun", "penalty / fine / punishment", "Das ist die Strafe.", "other"],
  ["", "strafbar", "adjective", "punishable / illegal", "Das ist strafbar.", "adjective"],
  ["der", "Strafzettel", "noun", "parking ticket / fine notice", "Das ist der Strafzettel.", "transport"],
  ["der", "Strand", "noun", "beach", "Das ist der Strand.", "places"],
  ["die", "Straße", "noun", "street / road", "Das ist die Straße.", "places"],
  ["die", "Straßenbahn", "noun", "tram / streetcar", "Das ist die Straßenbahn.", "transport"],
  ["die", "Strecke", "noun", "route / distance", "Das ist die Strecke.", "transport"],
  ["das", "Streichholz", "noun", "match / matchstick", "Das ist das Streichholz.", "house"],
  ["", "streiken", "verb", "to strike / go on strike", "Ich möchte streiken.", "verb"],
  ["der", "Streik", "noun", "strike / walkout", "Das ist der Streik.", "professions"],
  ["", "streiten", "verb", "to quarrel / argue / dispute", "Ich möchte streiten.", "verb"],
  ["der", "Streit", "noun", "argument / dispute / quarrel", "Das ist der Streit.", "other"],
  ["", "streng", "adjective", "strict / severe / harsh", "Das ist streng.", "adjective"],
  ["der", "Stress", "noun", "stress", "Das ist der Stress.", "other"],
  ["der", "Strom", "noun", "electricity / power / current", "Das ist der Strom.", "electronics"],
  ["der", "Strumpf", "noun", "stocking / sock", "Das ist der Strumpf.", "clothing"],
  ["das", "Stück", "noun", "piece / slice / play (theatre)", "Das ist das Stück.", "other"],
  ["die", "Studie", "noun", "study / survey", "Das ist die Studie.", "stationery"],
  ["der", "Student", "noun", "student (male)", "Der Student lernt Deutsch.", "people"],
  ["die", "Studentin", "noun", "student (female)", "Das ist die Studentin.", "people"],
  ["das", "Studium", "noun", "studies / degree course", "Das ist das Studium.", "professions"],
  ["das", "Studio", "noun", "studio", "Das ist das Studio.", "places"],
  ["die", "Stufe", "noun", "step / level / grade", "Das ist die Stufe.", "house"],
  ["der", "Stuhl", "noun", "chair", "Das ist ein Stuhl.", "furniture"],
  ["", "stumm", "adjective", "mute / silent", "Das ist stumm.", "adjective"],
  ["die", "Stunde", "noun", "hour / lesson", "Eine Stunde hat sechzig Minuten.", "time"],
  ["der", "Sturm", "noun", "storm / gale", "Das ist der Sturm.", "other"],
  ["", "stürzen", "verb", "to fall / crash / plunge", "Ich möchte stürzen.", "verb"],
  ["die", "Sucht", "noun", "addiction", "Das ist die Sucht.", "body"],
  ["", "süchtig", "adjective", "addicted", "Das ist süchtig.", "adjective"],
  ["die", "Summe", "noun", "sum / total", "Das ist die Summe.", "other"],
  ["", "super", "adjective", "super / great / fantastic", "Das ist super.", "adjective"],
  ["der", "Supermarkt", "noun", "supermarket", "Das ist der Supermarkt.", "places"],
  ["die", "Suppe", "noun", "soup", "Das ist die Suppe.", "food"],
  ["", "süß", "adjective", "sweet / cute", "Das ist süß.", "adjective"],
  ["das", "Symbol", "noun", "symbol / icon", "Das ist das Symbol.", "other"],
  ["", "sympathisch", "adjective", "pleasant / likeable / sympathetic", "Das ist sympathisch.", "adjective"],
  ["das", "System", "noun", "system", "Das ist das System.", "electronics"],
  ["die", "Szene", "noun", "scene", "Das ist die Szene.", "other"],
  ["die", "Tabelle", "noun", "table / chart", "Das ist die Tabelle.", "stationery"],
  ["die", "Tablette", "noun", "tablet / pill", "Das ist die Tablette.", "body"],
  ["die", "Tafel", "noun", "blackboard / bar (chocolate) / board", "Das ist die Tafel.", "stationery"],
  ["der", "Tagesablauf", "noun", "daily routine", "Das ist der Tagesablauf.", "time"],
  ["das", "Tal", "noun", "valley", "Das ist das Tal.", "places"],
  ["das", "Talent", "noun", "talent / gift", "Das ist das Talent.", "other"],
  ["", "tanken", "verb", "to refuel / get petrol", "Ich möchte tanken.", "verb"],
  ["die", "Tankstelle", "noun", "petrol station / gas station", "Das ist die Tankstelle.", "places"],
  ["die", "Tante", "noun", "aunt", "Das ist die Tante.", "family"],
  ["der", "Tanz", "noun", "dance", "Das ist der Tanz.", "other"],
  ["die", "Tasche", "noun", "bag / pocket", "Das ist die Tasche.", "clothing"],
  ["das", "Taschengeld", "noun", "pocket money / allowance", "Das ist das Taschengeld.", "other"],
  ["das", "Taschentuch", "noun", "handkerchief / tissue", "Das ist das Taschentuch.", "clothing"],
  ["die", "Tasse", "noun", "cup / mug", "Das ist die Tasse.", "tableware"],
  ["die", "Tastatur", "noun", "keyboard", "Das ist die Tastatur.", "electronics"],
  ["die", "Taste", "noun", "key / button", "Das ist die Taste.", "electronics"],
  ["die", "Tat", "noun", "act / deed", "Das ist die Tat.", "other"],
  ["der", "Täter", "noun", "culprit / perpetrator", "Das ist der Täter.", "people"],
  ["die", "Tätigkeit", "noun", "activity / occupation", "Das ist die Tätigkeit.", "professions"],
  ["die", "Tatsache", "noun", "fact", "Das ist die Tatsache.", "other"],
  ["", "tatsächlich", "adjective", "actual / indeed / really", "Das ist tatsächlich.", "adjective"],
  ["", "taub", "adjective", "deaf / numb", "Das ist taub.", "body"],
  ["", "tauchen", "verb", "to dive / submerge", "Ich möchte tauchen.", "verb"],
  ["", "tauschen", "verb", "to swap / exchange", "Ich möchte tauschen.", "verb"],
  ["die", "Technik", "noun", "technology / technique", "Das ist die Technik.", "other"],
  ["", "technisch", "adjective", "technical", "Das ist technisch.", "adjective"],
  ["die", "Technologie", "noun", "technology", "Das ist die Technologie.", "other"],
  ["der", "Tee", "noun", "tea", "Ich trinke Tee.", "food"],
  ["", "teilen", "verb", "to divide / share", "Ich möchte teilen.", "verb"],
  ["das", "Teil", "noun", "part / piece (object)", "Das ist das Teil.", "other"],
  ["der", "Teil", "noun", "part / section", "Das ist der Teil.", "other"],
  ["die", "Teilzeit", "noun", "part-time", "Das ist die Teilzeit.", "professions"],
  ["", "teilnehmen", "verb", "to participate / take part", "Ich möchte teilnehmen.", "verb"],
  ["die", "Teilnahme", "noun", "participation", "Das ist die Teilnahme.", "other"],
  ["der", "Teilnehmer", "noun", "participant (male)", "Das ist der Teilnehmer.", "people"],
  ["die", "Teilnehmerin", "noun", "participant (female)", "Das ist die Teilnehmerin.", "people"],
  ["", "telefonieren", "verb", "to make a phone call / phone", "Ich telefoniere mit meiner Mutter.", "verb"],
  ["das", "Telefon", "noun", "telephone / phone", "Das ist das Telefon.", "electronics"],
  ["der", "Teller", "noun", "plate", "Das ist der Teller.", "tableware"],
  ["die", "Temperatur", "noun", "temperature", "Das ist die Temperatur.", "other"],
  ["das", "Tempo", "noun", "speed / tempo / pace", "Das ist das Tempo.", "transport"],
  ["das", "Tennis", "noun", "tennis", "Das ist das Tennis.", "other"],
  ["der", "Teppich", "noun", "carpet / rug", "Das ist der Teppich.", "furniture"],
  ["der", "Termin", "noun", "appointment / date", "Ich habe morgen einen Termin.", "time"],
  ["der", "Terminkalender", "noun", "appointment book / planner", "Das ist der Terminkalender.", "stationery"],
  ["die", "Terrasse", "noun", "terrace / patio", "Das ist die Terrasse.", "house"],
  ["", "testen", "verb", "to test / try out", "Ich möchte testen.", "verb"],
  ["der", "Test", "noun", "test / exam", "Das ist der Test.", "stationery"],
  ["", "teuer", "adjective", "expensive / costly", "Das ist teuer.", "adjective"],
  ["der", "Text", "noun", "text / passage", "Das ist der Text.", "stationery"],
  ["das", "Theater", "noun", "theatre / drama", "Das ist das Theater.", "places"],
  ["das", "Thema", "noun", "topic / theme / subject", "Das ist das Thema.", "other"],
  ["", "theoretisch", "adjective", "theoretical / in theory", "Das ist theoretisch.", "adjective"],
  ["die", "Theorie", "noun", "theory", "Das ist die Theorie.", "other"],
  ["die", "Therapie", "noun", "therapy / treatment", "Das ist die Therapie.", "body"],
  ["das", "Ticket", "noun", "ticket", "Das ist das Ticket.", "transport"],
  ["", "tief", "adjective", "deep / low", "Das ist tief.", "adjective"],
  ["das", "Tier", "noun", "animal / pet", "Das ist das Tier.", "other"],
  ["der", "Tierpark", "noun", "zoo / animal park", "Das ist der Tierpark.", "places"],
  ["der", "Tipp", "noun", "tip / hint / piece of advice", "Das ist der Tipp.", "other"],
  ["", "tippen", "verb", "to type / tap", "Ich möchte tippen.", "verb"],
  ["der", "Tisch", "noun", "table", "Das ist ein Tisch.", "furniture"],
  ["der", "Titel", "noun", "title / headline", "Das ist der Titel.", "stationery"],
  ["die", "Tochter", "noun", "daughter", "Das ist meine Tochter.", "family"],
  ["der", "Tod", "noun", "death", "Das ist der Tod.", "other"],
  ["", "tödlich", "adjective", "fatal / deadly / lethal", "Das ist tödlich.", "adjective"],
  ["die", "Toilette", "noun", "toilet / restroom", "Das ist die Toilette.", "house"],
  ["", "tolerant", "adjective", "tolerant / open-minded", "Das ist tolerant.", "adjective"],
  ["", "toll", "adjective", "great / fantastic / awesome", "Das ist toll.", "adjective"],
  ["die", "Tomate", "noun", "tomato", "Das ist die Tomate.", "food"],
  ["der", "Topf", "noun", "pot / saucepan / pan", "Das ist der Topf.", "tableware"],
  ["das", "Tor", "noun", "gate / goal (sports)", "Das ist das Tor.", "other"],
  ["die", "Torte", "noun", "gateau / cake / tart", "Das ist die Torte.", "food"],
  ["", "tot", "adjective", "dead / deceased", "Das ist tot.", "adjective"],
  ["", "total", "adjective", "total / complete / totally", "Das ist total.", "adjective"],
  ["der", "Tourismus", "noun", "tourism", "Das ist der Tourismus.", "other"],
  ["der", "Tourist", "noun", "tourist", "Das ist der Tourist.", "people"],
  ["die", "Tradition", "noun", "tradition / custom", "Das ist die Tradition.", "other"],
  ["", "traditionell", "adjective", "traditional", "Das ist traditionell.", "adjective"],
  ["", "tragen", "verb", "to carry / wear", "Ich möchte tragen.", "verb"],
  ["", "trainieren", "verb", "to train / practice", "Ich möchte trainieren.", "verb"],
  ["der", "Trainer", "noun", "coach / trainer", "Das ist der Trainer.", "professions"],
  ["das", "Training", "noun", "training / practice / workout", "Das ist das Training.", "other"],
  ["die", "Träne", "noun", "tear (drop)", "Das ist die Träne.", "body"],
  ["", "transportieren", "verb", "to transport / carry", "Ich möchte transportieren.", "verb"],
  ["der", "Transport", "noun", "transport / carriage", "Das ist der Transport.", "transport"],
  ["", "träumen", "verb", "to dream", "Ich möchte träumen.", "verb"],
  ["der", "Traum", "noun", "dream", "Das ist der Traum.", "other"],
  ["", "traurig", "adjective", "sad / sorrowful", "Ich bin traurig.", "adjective"],
  ["", "treffen", "verb", "to meet / hit", "Ich treffe meinen Freund.", "verb"],
  ["der", "Treffpunkt", "noun", "meeting point", "Das ist der Treffpunkt.", "places"],
  ["", "treiben", "verb", "to drive / pursue / do (sports)", "Ich möchte treiben.", "verb"],
  ["", "trennen", "verb", "to separate / divide", "Ich möchte trennen.", "verb"],
  ["die", "Trennung", "noun", "separation / breakup", "Das ist die Trennung.", "other"],
  ["die", "Treppe", "noun", "stairs / staircase", "Das ist die Treppe.", "house"],
  ["das", "Treppenhaus", "noun", "stairwell / staircase", "Das ist das Treppenhaus.", "house"],
  ["", "treten", "verb", "to step / kick / tread", "Ich möchte treten.", "verb"],
  ["", "treu", "adjective", "loyal / faithful", "Das ist treu.", "adjective"],
  ["das", "Trinkgeld", "noun", "tip / gratuity", "Das ist das Trinkgeld.", "other"],
  ["", "trocken", "adjective", "dry", "Das ist trocken.", "adjective"],
  ["", "trocknen", "verb", "to dry", "Ich möchte trocknen.", "verb"],
  ["die", "Tropfen", "noun", "drops (medicine)", "Das ist die Tropfen.", "body"],
  ["", "trotz", "other", "in spite of / despite", "Trotz des Regens gehe ich spazieren.", "other"],
  ["", "trotzdem", "other", "nevertheless / still", "Ich lerne das Wort „trotzdem“.", "other"],
  ["das", "Tuch", "noun", "cloth / scarf / towel", "Das ist das Tuch.", "house"],
  ["", "tun", "verb", "to do / put / act", "Ich möchte tun.", "verb"],
  ["die", "Tür", "noun", "door", "Die Tür ist offen.", "house"],
  ["der", "Turm", "noun", "tower / steeple", "Das ist der Turm.", "places"],
  ["die", "Tüte", "noun", "bag (plastic/paper) / cone", "Das ist die Tüte.", "other"],
  ["der", "Typ", "noun", "type / guy / model", "Das ist der Typ.", "people"],
  ["", "typisch", "adjective", "typical / characteristic", "Das ist typisch.", "adjective"],
  ["die", "U-Bahn", "noun", "underground / subway", "Das ist die U-Bahn.", "transport"],
  ["", "üben", "verb", "to practice / exercise", "Ich möchte üben.", "verb"],
  ["die", "Übung", "noun", "exercise / practice", "Das ist die Übung.", "stationery"],
  ["", "über", "other", "over / above / about / across", "Das Bild hängt über dem Sofa.", "other"],
  ["", "überall", "adverb", "everywhere", "Ich mache das überall.", "adverb"],
  ["", "überfahren", "verb", "to run over / knock down", "Ich möchte überfahren.", "verb"],
  ["", "überhaupt", "adverb", "at all / generally", "Ich mache das überhaupt.", "adverb"],
  ["", "überholen", "verb", "to overtake / pass", "Ich möchte überholen.", "verb"],
  ["", "überlegen", "verb", "to consider / think over", "Ich möchte überlegen.", "verb"],
  ["", "übermorgen", "adverb", "the day after tomorrow", "Ich mache das übermorgen.", "calendar"],
  ["die", "Übernachtung", "noun", "overnight stay", "Das ist die Übernachtung.", "places"],
  ["", "übernehmen", "verb", "to take over / assume", "Ich möchte übernehmen.", "verb"],
  ["", "überprüfen", "verb", "to check / verify", "Ich möchte überprüfen.", "verb"],
  ["", "überqueren", "verb", "to cross (street/border)", "Ich möchte überqueren.", "verb"],
  ["", "überraschen", "verb", "to surprise", "Ich möchte überraschen.", "verb"],
  ["die", "Überraschung", "noun", "surprise", "Das ist die Überraschung.", "other"],
  ["", "überreden", "verb", "to persuade / talk into", "Ich möchte überreden.", "verb"],
  ["die", "Überschrift", "noun", "heading / headline / title", "Das ist die Überschrift.", "stationery"],
  ["", "übersetzen", "verb", "to translate", "Ich möchte übersetzen.", "verb"],
  ["der", "Übersetzer", "noun", "translator (male)", "Das ist der Übersetzer.", "professions"],
  ["die", "Übersetzerin", "noun", "translator (female)", "Das ist die Übersetzerin.", "professions"],
  ["die", "Übersetzung", "noun", "translation", "Das ist die Übersetzung.", "stationery"],
  ["die", "Überstunde", "noun", "overtime", "Das ist die Überstunde.", "professions"],
  ["", "übertreiben", "verb", "to exaggerate", "Ich möchte übertreiben.", "verb"],
  ["", "überweisen", "verb", "to transfer (money) / refer", "Ich überweise das Geld.", "verb"],
  ["die", "Überweisung", "noun", "bank transfer / referral", "Das ist die Überweisung.", "other"],
  ["", "überzeugen", "verb", "to convince / persuade", "Ich möchte überzeugen.", "verb"],
  ["die", "Überzeugung", "noun", "conviction / belief", "Das ist die Überzeugung.", "other"],
  ["", "üblich", "adjective", "usual / customary", "Das ist üblich.", "adjective"],
  ["", "übrig", "adjective", "left over / remaining", "Das ist übrig.", "adjective"],
  ["", "übrigens", "adverb", "by the way / incidentally", "Ich mache das übrigens.", "adverb"],
  ["das", "Ufer", "noun", "bank / shore", "Das ist das Ufer.", "places"],
  ["die", "Uhr", "noun", "clock / watch / o'clock", "Das ist die Uhr.", "electronics"],
  ["", "um", "other", "around / at (time) / by", "Wir treffen uns um acht Uhr.", "other"],
  ["", "umarmen", "verb", "to hug / embrace", "Ich möchte umarmen.", "verb"],
  ["", "sich umdrehen", "verb", "to turn around", "Ich möchte sich umdrehen.", "verb"],
  ["die", "Umfrage", "noun", "survey / poll", "Das ist die Umfrage.", "other"],
  ["die", "Umgebung", "noun", "surroundings / vicinity", "Das ist die Umgebung.", "places"],
  ["", "umgehen", "verb", "to handle / treat / bypass", "Ich möchte umgehen.", "verb"],
  ["", "umgekehrt", "adverb", "the other way around / vice versa", "Ich mache das umgekehrt.", "adverb"],
  ["die", "Umleitung", "noun", "diversion / detour", "Das ist die Umleitung.", "transport"],
  ["", "umso", "other", "all the (more) / so much the", "Ich lerne das Wort „umso“.", "other"],
  ["", "umsonst", "adverb", "for free / in vain", "Ich mache das umsonst.", "adverb"],
  ["", "umsteigen", "verb", "to change (trains/buses)", "Ich möchte umsteigen.", "verb"],
  ["", "umtauschen", "verb", "to exchange (goods/currency)", "Ich möchte umtauschen.", "verb"],
  ["die", "Umwelt", "noun", "environment", "Das ist die Umwelt.", "other"],
  ["der", "Umweltschutz", "noun", "environmental protection", "Das ist der Umweltschutz.", "other"],
  ["die", "Umweltverschmutzung", "noun", "environmental pollution", "Das ist die Umweltverschmutzung.", "other"],
  ["", "umziehen", "verb", "to move house / change clothes", "Ich möchte umziehen.", "verb"],
  ["der", "Umzug", "noun", "move / relocation / parade", "Das ist der Umzug.", "house"],
  ["", "unbedingt", "adverb", "absolutely / unconditionally", "Ich mache das unbedingt.", "adverb"],
  ["der", "Unfall", "noun", "accident", "Das ist der Unfall.", "other"],
  ["", "ungefähr", "adverb", "approximately / about", "Ich mache das ungefähr.", "adverb"],
  ["", "ungewöhnlich", "adjective", "unusual / uncommon", "Das ist ungewöhnlich.", "adjective"],
  ["", "unglaublich", "adjective", "incredible / unbelievable", "Das ist unglaublich.", "adjective"],
  ["das", "Unglück", "noun", "accident / misfortune / disaster", "Das ist das Unglück.", "other"],
  ["", "unheimlich", "adjective", "eerie / creepy / terribly", "Das ist unheimlich.", "adjective"],
  ["die", "Uniform", "noun", "uniform", "Das ist die Uniform.", "clothing"],
  ["die", "Universität", "noun", "university", "Das ist die Universität.", "places"],
  ["", "unter", "other", "under / below / among", "Die Tasche ist unter dem Tisch.", "other"],
  ["", "unterbrechen", "verb", "to interrupt / suspend", "Ich möchte unterbrechen.", "verb"],
  ["", "sich unterhalten", "verb", "to converse / chat / enjoy oneself", "Ich möchte sich unterhalten.", "verb"],
  ["die", "Unterhaltung", "noun", "entertainment / conversation", "Das ist die Unterhaltung.", "other"],
  ["die", "Unterkunft", "noun", "accommodation / lodging", "Das ist die Unterkunft.", "places"],
  ["die", "Unterlagen", "noun", "documents / paperwork", "Das sind die Unterlagen.", "stationery"],
  ["", "unterlassen", "verb", "to refrain from / omit", "Ich möchte unterlassen.", "verb"],
  ["", "unternehmen", "verb", "to undertake / do", "Ich möchte unternehmen.", "verb"],
  ["der", "Unternehmer", "noun", "entrepreneur / business owner", "Das ist der Unternehmer.", "professions"],
  ["", "unterrichten", "verb", "to teach / instruct", "Sie unterrichtet Deutsch.", "verb"],
  ["der", "Unterricht", "noun", "lesson / class / tuition", "Das ist der Unterricht.", "other"],
  ["", "unterscheiden", "verb", "to distinguish / differentiate", "Ich möchte unterscheiden.", "verb"],
  ["der", "Unterschied", "noun", "difference", "Das ist der Unterschied.", "other"],
  ["", "unterschiedlich", "adjective", "different / varying", "Das ist unterschiedlich.", "adjective"],
  ["die", "Unterschrift", "noun", "signature", "Das ist die Unterschrift.", "other"],
  ["", "unterstreichen", "verb", "to underline / emphasize", "Ich möchte unterstreichen.", "verb"],
  ["", "unterstützen", "verb", "to support / assist", "Ich möchte unterstützen.", "verb"],
  ["die", "Unterstützung", "noun", "support / assistance", "Das ist die Unterstützung.", "other"],
  ["", "untersuchen", "verb", "to examine / investigate", "Ich möchte untersuchen.", "verb"],
  ["die", "Untersuchung", "noun", "examination / medical checkup", "Das ist die Untersuchung.", "body"],
  ["", "unterwegs", "adverb", "on the way / en route", "Ich mache das unterwegs.", "adverb"],
  ["die", "Urkunde", "noun", "certificate / official document", "Das ist die Urkunde.", "stationery"],
  ["der", "Urlaub", "noun", "holiday / vacation", "Ich bin im Urlaub.", "calendar"],
  ["die", "Ursache", "noun", "cause / reason", "Das ist die Ursache.", "other"],
  ["", "verursachen", "verb", "to cause / provoke", "Ich möchte verursachen.", "verb"],
  ["", "ursprünglich", "adjective", "original / originally", "Das ist ursprünglich.", "adjective"],
  ["das", "Urteil", "noun", "judgment / sentence / verdict", "Das ist das Urteil.", "other"],
  ["die", "Vase", "noun", "vase", "Das ist die Vase.", "house"],
  ["der", "Vater", "noun", "father", "Das ist mein Vater.", "family"],
  ["", "vegetarisch", "adjective", "vegetarian", "Das ist vegetarisch.", "adjective"],
  ["", "sich verabreden", "verb", "to arrange to meet / make a date", "Ich möchte sich verabreden.", "verb"],
  ["die", "Verabredung", "noun", "appointment / date", "Das ist die Verabredung.", "other"],
  ["", "sich verabschieden", "verb", "to say goodbye / take leave", "Ich möchte sich verabschieden.", "verb"],
  ["der", "Abschied", "noun", "farewell / departure", "Das ist der Abschied.", "other"],
  ["", "verändern", "verb", "to change / alter", "Ich möchte verändern.", "verb"],
  ["die", "Veranstaltung", "noun", "event / function", "Das ist die Veranstaltung.", "other"],
  ["", "verantwortlich", "adjective", "responsible", "Das ist verantwortlich.", "adjective"],
  ["die", "Verantwortung", "noun", "responsibility", "Das ist die Verantwortung.", "other"],
  ["", "verbessern", "verb", "to improve / correct", "Ich möchte verbessern.", "verb"],
  ["", "verbieten", "verb", "to forbid / prohibit", "Ich möchte verbieten.", "verb"],
  ["das", "Verbot", "noun", "prohibition / ban", "Das ist das Verbot.", "other"],
  ["", "verbinden", "verb", "to connect / bind / bandage", "Ich möchte verbinden.", "verb"],
  ["die", "Verbindung", "noun", "connection / transfer", "Das ist die Verbindung.", "transport"],
  ["", "verbrauchen", "verb", "to consume / use up", "Ich möchte verbrauchen.", "verb"],
  ["der", "Verbrecher", "noun", "criminal (male)", "Das ist der Verbrecher.", "people"],
  ["", "verbrennen", "verb", "to burn / scorch", "Ich möchte verbrennen.", "verb"],
  ["", "verbringen", "verb", "to spend (time)", "Ich möchte verbringen.", "verb"],
  ["der", "Verdacht", "noun", "suspicion", "Das ist der Verdacht.", "other"],
  ["", "verdächtig", "adjective", "suspicious", "Das ist verdächtig.", "adjective"],
  ["der", "Verein", "noun", "club / association", "Das ist der Verein.", "other"],
  ["", "vereinbaren", "verb", "to arrange / agree on", "Ich möchte vereinbaren.", "verb"],
  ["die", "Vergangenheit", "noun", "past", "Das ist die Vergangenheit.", "time"],
  ["", "vergeblich", "adjective", "in vain / futile", "Das ist vergeblich.", "adjective"],
  ["", "vergleichen", "verb", "to compare", "Ich möchte vergleichen.", "verb"],
  ["der", "Vergleich", "noun", "comparison", "Das ist der Vergleich.", "other"],
  ["", "sich vergnügen", "verb", "to enjoy oneself / have fun", "Ich möchte sich vergnügen.", "verb"],
  ["das", "Vergnügen", "noun", "pleasure / enjoyment", "Das ist das Vergnügen.", "other"],
  ["", "vergrößern", "verb", "to enlarge / expand", "Ich möchte vergrößern.", "verb"],
  ["", "verhaften", "verb", "to arrest", "Ich möchte verhaften.", "verb"],
  ["", "sich verhalten", "verb", "to behave / act", "Ich möchte sich verhalten.", "verb"],
  ["das", "Verhalten", "noun", "behavior / conduct", "Das ist das Verhalten.", "other"],
  ["das", "Verhältnis", "noun", "relationship / ratio / condition", "Das ist das Verhältnis.", "other"],
  ["", "verhindern", "verb", "to prevent / hinder", "Ich möchte verhindern.", "verb"],
  ["der", "Verkäufer", "noun", "salesperson / shop assistant (male)", "Das ist der Verkäufer.", "professions"],
  ["die", "Verkäuferin", "noun", "salesperson / shop assistant (female)", "Das ist die Verkäuferin.", "professions"],
  ["der", "Verkehr", "noun", "traffic / transport", "Das ist der Verkehr.", "transport"],
  ["das", "Verkehrsmittel", "noun", "means of transport", "Das ist das Verkehrsmittel.", "transport"],
  ["der", "Verlag", "noun", "publishing house / publisher", "Das ist der Verlag.", "professions"],
  ["", "verlangen", "verb", "to demand / require", "Ich möchte verlangen.", "verb"],
  ["", "verlängern", "verb", "to extend / renew / prolong", "Ich möchte verlängern.", "verb"],
  ["", "verlassen", "verb", "to leave / abandon / rely on", "Ich möchte verlassen.", "verb"],
  ["", "sich verlaufen", "verb", "to get lost (walking)", "Ich möchte sich verlaufen.", "verb"],
  ["", "verletzen", "verb", "to injure / hurt", "Ich möchte verletzen.", "verb"],
  ["die", "Verletzung", "noun", "injury / wound", "Das ist die Verletzung.", "body"],
  ["", "verlieben", "verb", "to fall in love", "Ich möchte verlieben.", "verb"],
  ["", "verliebt", "adjective", "in love", "Das ist verliebt.", "adjective"],
  ["", "verlieren", "verb", "to lose", "Ich möchte verlieren.", "verb"],
  ["der", "Verlust", "noun", "loss", "Das ist der Verlust.", "other"],
  ["", "vermeiden", "verb", "to avoid / prevent", "Ich möchte vermeiden.", "verb"],
  ["", "vermieten", "verb", "to rent out / let", "Wir vermieten die Wohnung.", "verb"],
  ["der", "Vermieter", "noun", "landlord", "Das ist der Vermieter.", "people"],
  ["die", "Vermieterin", "noun", "landlady", "Das ist die Vermieterin.", "people"],
  ["", "vermissen", "verb", "to miss (somebody/something)", "Ich möchte vermissen.", "verb"],
  ["", "vermuten", "verb", "to presume / suspect / assume", "Ich möchte vermuten.", "verb"],
  ["", "vermutlich", "adverb", "presumably / probably", "Ich mache das vermutlich.", "adverb"],
  ["", "vernünftig", "adjective", "sensible / reasonable", "Das ist vernünftig.", "adjective"],
  ["", "verpacken", "verb", "to pack / wrap", "Ich möchte verpacken.", "verb"],
  ["", "verpassen", "verb", "to miss (train/chance)", "Ich möchte verpassen.", "verb"],
  ["", "verpflichtet", "adjective", "obliged / committed", "Das ist verpflichtet.", "adjective"],
  ["", "verreisen", "verb", "to travel / go on a trip", "Ich möchte verreisen.", "verb"],
  ["", "verrückt", "adjective", "crazy / mad", "Das ist verrückt.", "adjective"],
  ["die", "Versammlung", "noun", "meeting / assembly / gathering", "Das ist die Versammlung.", "other"],
  ["", "versäumen", "verb", "to miss / neglect", "Ich möchte versäumen.", "verb"],
  ["", "verschieben", "verb", "to postpone / move / shift", "Ich möchte verschieben.", "verb"],
  ["", "verschieden", "adjective", "different / diverse / various", "Das ist verschieden.", "adjective"],
  ["", "verschreiben", "verb", "to prescribe (medicine)", "Ich möchte verschreiben.", "verb"],
  ["", "verschwinden", "verb", "to disappear / vanish", "Ich möchte verschwinden.", "verb"],
  ["", "versichern", "verb", "to insure / assure", "Ich möchte versichern.", "verb"],
  ["die", "Versicherung", "noun", "insurance", "Das ist die Versicherung.", "other"],
  ["die", "Verspätung", "noun", "delay", "Das ist die Verspätung.", "transport"],
  ["", "versprechen", "verb", "to promise", "Ich möchte versprechen.", "verb"],
  ["", "verständlich", "adjective", "understandable / clear", "Das ist verständlich.", "adjective"],
  ["das", "Verständnis", "noun", "understanding / comprehension", "Das ist das Verständnis.", "other"],
  ["", "verstecken", "verb", "to hide / conceal", "Ich möchte verstecken.", "verb"],
  ["der", "Versuch", "noun", "attempt / trial / experiment", "Das ist der Versuch.", "other"],
  ["", "verteilen", "verb", "to distribute / divide", "Ich möchte verteilen.", "verb"],
  ["der", "Vertrag", "noun", "contract / agreement", "Das ist der Vertrag.", "other"],
  ["", "vertrauen", "verb", "to trust / rely on", "Ich möchte vertrauen.", "verb"],
  ["das", "Vertrauen", "noun", "trust / confidence", "Das ist das Vertrauen.", "other"],
  ["", "vertreten", "verb", "to represent / substitute for", "Ich möchte vertreten.", "verb"],
  ["der", "Vertreter", "noun", "representative / agent (male)", "Das ist der Vertreter.", "professions"],
  ["die", "Vertreterin", "noun", "representative / agent (female)", "Das ist die Vertreterin.", "professions"],
  ["die", "Vertretung", "noun", "substitution / representation", "Das ist die Vertretung.", "professions"],
  ["", "verurteilen", "verb", "to condemn / sentence", "Ich möchte verurteilen.", "verb"],
  ["die", "Verwaltung", "noun", "administration / management", "Das ist die Verwaltung.", "places"],
  ["", "verwandt", "adjective", "related", "Das ist verwandt.", "adjective"],
  ["der", "Verwandte", "noun", "relative / relation", "Das ist der Verwandte.", "family"],
  ["", "verwechseln", "verb", "to confuse / mistake for", "Ich möchte verwechseln.", "verb"],
  ["", "verwenden", "verb", "to use / apply / utilize", "Ich möchte verwenden.", "verb"],
  ["", "verzeihen", "verb", "to forgive / pardon", "Ich möchte verzeihen.", "verb"],
  ["", "verzichten", "verb", "to do without / renounce", "Ich möchte verzichten.", "verb"],
  ["das", "Video", "noun", "video", "Das ist das Video.", "electronics"],
  ["", "vielleicht", "adverb", "perhaps / maybe", "Vielleicht komme ich morgen.", "adverb"],
  ["das", "Viertel", "noun", "quarter / neighborhood", "Das ist das Viertel.", "places"],
  ["", "virtuell", "adjective", "virtual", "Das ist virtuell.", "adjective"],
  ["das", "Visum", "noun", "visa", "Das ist das Visum.", "other"],
  ["das", "Vitamin", "noun", "vitamin", "Das ist das Vitamin.", "food"],
  ["", "voll", "adjective", "full / crowded", "Das ist voll.", "adjective"],
  ["die", "Vollzeit", "noun", "full-time", "Das ist die Vollzeit.", "professions"],
  ["", "völlig", "adjective", "complete / totally / fully", "Das ist völlig.", "adjective"],
  ["", "von", "other", "from / of / by", "Das Geschenk ist von meiner Mutter.", "other"],
  ["", "voneinander", "adverb", "from each other", "Ich mache das voneinander.", "adverb"],
  ["", "vor", "other", "before / in front of / ago", "Das Auto steht vor dem Haus.", "other"],
  ["", "vor allem", "phrase", "above all / especially", "Vor allem lerne ich neue Wörter.", "other"],
  ["", "voraus", "adverb", "ahead / in advance", "Ich mache das voraus.", "adverb"],
  ["die", "Voraussetzung", "noun", "prerequisite / condition", "Das ist die Voraussetzung.", "other"],
  ["", "voraussichtlich", "adjective", "expected / probable", "Das ist voraussichtlich.", "adjective"],
  ["", "vorbei", "adverb", "past / over / by", "Ich mache das vorbei.", "adverb"],
  ["", "sich vorbereiten", "verb", "to prepare (oneself)", "Ich möchte sich vorbereiten.", "verb"],
  ["die", "Vorbereitung", "noun", "preparation", "Das ist die Vorbereitung.", "other"],
  ["die", "Vorfahrt", "noun", "right of way / priority", "Das ist die Vorfahrt.", "transport"],
  ["", "vorgestern", "adverb", "the day before yesterday", "Ich mache das vorgestern.", "calendar"],
  ["", "vorhaben", "verb", "to plan / intend", "Ich möchte vorhaben.", "verb"],
  ["", "vorher", "adverb", "beforehand / previously", "Ich mache das vorher.", "adverb"],
  ["", "vorhin", "adverb", "earlier / just now", "Ich mache das vorhin.", "adverb"],
  ["", "vorkommen", "verb", "to happen / occur / seem", "Ich möchte vorkommen.", "verb"],
  ["", "vorläufig", "adjective", "provisional / temporary", "Das ist vorläufig.", "adjective"],
  ["", "vorlesen", "verb", "to read aloud", "Ich möchte vorlesen.", "verb"],
  ["", "vorn", "adverb", "in front / at the front", "Ich mache das vorn.", "places"],
  ["", "vorschlagen", "verb", "to suggest / propose", "Ich möchte vorschlagen.", "verb"],
  ["der", "Vorschlag", "noun", "suggestion / proposal", "Das ist der Vorschlag.", "other"],
  ["die", "Vorschrift", "noun", "regulation / rule / instruction", "Das ist die Vorschrift.", "other"],
  ["die", "Vorsicht", "noun", "caution / care / attention", "Das ist die Vorsicht.", "other"],
  ["", "vorsichtig", "adjective", "careful / cautious", "Das ist vorsichtig.", "adjective"],
  ["die", "Vorstellung", "noun", "performance / idea / introduction", "Das ist die Vorstellung.", "other"],
  ["das", "Vorstellungsgespräch", "noun", "job interview", "Das ist das Vorstellungsgespräch.", "professions"],
  ["der", "Vorteil", "noun", "advantage / benefit", "Das ist der Vorteil.", "other"],
  ["der", "Vortrag", "noun", "lecture / presentation / talk", "Das ist der Vortrag.", "stationery"],
  ["die", "Vorwahl", "noun", "area code / dialing code", "Das ist die Vorwahl.", "other"],
  ["", "vorwärts", "adverb", "forward / forwards", "Ich mache das vorwärts.", "adverb"],
  ["der", "Vorwurf", "noun", "accusation / reproach", "Das ist der Vorwurf.", "other"],
  ["", "waagerecht", "adjective", "horizontal", "Das ist waagerecht.", "adjective"],
  ["", "wach", "adjective", "awake", "Das ist wach.", "adjective"],
  ["", "wachsen", "verb", "to grow / increase", "Ich möchte wachsen.", "verb"],
  ["der", "Wagen", "noun", "car / carriage / cart", "Das ist der Wagen.", "transport"],
  ["", "wählen", "verb", "to choose / vote / dial", "Ich möchte wählen.", "verb"],
  ["die", "Wahl", "noun", "election / choice", "Das ist die Wahl.", "other"],
  ["", "wahr", "adjective", "true / real", "Das ist wahr.", "adjective"],
  ["die", "Wahrheit", "noun", "truth", "Das ist die Wahrheit.", "other"],
  ["", "während", "other", "during / while", "Während des Essens sprechen wir wenig.", "other"],
  ["", "wahrscheinlich", "adjective", "probable / probably", "Das ist wahrscheinlich.", "adjective"],
  ["der", "Wald", "noun", "forest / woods", "Das ist der Wald.", "places"],
  ["die", "Wand", "noun", "wall", "Das ist die Wand.", "house"],
  ["", "wandern", "verb", "to hike / walk", "Ich möchte wandern.", "verb"],
  ["die", "Wanderung", "noun", "hike / walking tour", "Das ist die Wanderung.", "places"],
  ["die", "Ware", "noun", "goods / merchandise / commodity", "Das ist die Ware.", "other"],
  ["", "warm", "adjective", "warm", "Das ist warm.", "adjective"],
  ["die", "Wärme", "noun", "warmth / heat", "Das ist die Wärme.", "other"],
  ["", "warnen", "verb", "to warn / caution", "Ich möchte warnen.", "verb"],
  ["die", "Wäsche", "noun", "laundry / washing / linen", "Das ist die Wäsche.", "house"],
  ["das", "Waschmittel", "noun", "detergent / washing powder", "Das ist das Waschmittel.", "house"],
  ["die", "Waschmaschine", "noun", "washing machine", "Das ist die Waschmaschine.", "electronics"],
  ["das", "Wasser", "noun", "water", "Ich trinke Wasser.", "food"],
  ["", "wechseln", "verb", "to change / exchange", "Ich möchte wechseln.", "verb"],
  ["", "wecken", "verb", "to wake up / awaken", "Ich möchte wecken.", "verb"],
  ["der", "Wecker", "noun", "alarm clock", "Das ist der Wecker.", "electronics"],
  ["", "weder ... noch", "other", "neither ... nor", "Ich lerne das Wort „weder ... noch“.", "other"],
  ["der", "Weg", "noun", "way / path / route", "Das ist der Weg.", "places"],
  ["", "weg", "adverb", "away / gone", "Ich mache das weg.", "adverb"],
  ["", "wegen", "other", "because of / on account of", "Wegen des Regens bleibe ich zu Hause.", "other"],
  ["", "wehtun", "verb", "to hurt / ache", "Ich möchte wehtun.", "verb"],
  ["", "weich", "adjective", "soft / smooth", "Das ist weich.", "adjective"],
  ["", "sich weigern", "verb", "to refuse", "Ich möchte sich weigern.", "verb"],
  ["", "weil", "other", "because", "Ich bleibe zu Hause, weil ich krank bin.", "other"],
  ["der", "Wein", "noun", "wine", "Sie trinkt Wein.", "food"],
  ["", "weinen", "verb", "to weep / cry", "Ich möchte weinen.", "verb"],
  ["", "weit", "adjective", "far / distant / wide", "Das ist weit.", "adjective"],
  ["", "weiter", "adverb", "further / on / continue", "Bitte gehen Sie weiter.", "adverb"],
  ["die", "Weiterbildung", "noun", "further education / training", "Das ist die Weiterbildung.", "professions"],
  ["die", "Welt", "noun", "world", "Das ist die Welt.", "places"],
  ["", "weltweit", "adjective", "worldwide / global", "Das ist weltweit.", "adjective"],
  ["", "wenden", "verb", "to turn / turn around", "Ich möchte wenden.", "verb"],
  ["", "wenigstens", "adverb", "at least", "Ich mache das wenigstens.", "adverb"],
  ["", "wenn", "other", "if / when", "Wenn ich Zeit habe, lerne ich Deutsch.", "other"],
  ["die", "Werbung", "noun", "advertising / commercial", "Das ist die Werbung.", "other"],
  ["", "werden", "verb", "to become / get / will (future)", "Ich werde morgen arbeiten.", "verb"],
  ["", "werfen", "verb", "to throw / toss", "Ich möchte werfen.", "verb"],
  ["das", "Werk", "noun", "work / plant / factory", "Das ist das Werk.", "places"],
  ["die", "Werkstatt", "noun", "workshop / garage (repair)", "Das ist die Werkstatt.", "places"],
  ["das", "Werkzeug", "noun", "tool", "Das ist das Werkzeug.", "house"],
  ["", "wert", "adjective", "worth / valuable", "Das ist wert.", "adjective"],
  ["der", "Wert", "noun", "value / worth", "Das ist der Wert.", "other"],
  ["", "wertlos", "adjective", "worthless / valueless", "Das ist wertlos.", "adjective"],
  ["", "wertvoll", "adjective", "valuable / precious", "Das ist wertvoll.", "adjective"],
  ["", "weshalb", "adverb", "why / for what reason", "Ich mache das weshalb.", "adverb"],
  ["der", "Wettbewerb", "noun", "competition / contest", "Das ist der Wettbewerb.", "other"],
  ["", "wetten", "verb", "to bet / wager", "Ich möchte wetten.", "verb"],
  ["das", "Wetter", "noun", "weather", "Das ist das Wetter.", "other"],
  ["der", "Wetterbericht", "noun", "weather forecast / report", "Das ist der Wetterbericht.", "other"],
  ["", "wichtig", "adjective", "important / essential", "Das ist wichtig.", "adjective"],
  ["", "widersprechen", "verb", "to contradict / disagree", "Ich möchte widersprechen.", "verb"],
  ["", "wie", "adverb", "how / like / as", "Wie geht es dir?", "adverb"],
  ["", "wieder", "adverb", "again / once more", "Ich komme wieder.", "adverb"],
  ["", "wiederholen", "verb", "to repeat / revise", "Ich möchte wiederholen.", "verb"],
  ["die", "Wiederholung", "noun", "repetition / rerun", "Das ist die Wiederholung.", "other"],
  ["", "wiegen", "verb", "to weigh", "Ich möchte wiegen.", "verb"],
  ["", "wild", "adjective", "wild / fierce", "Das ist wild.", "adjective"],
  ["die", "Wiese", "noun", "meadow / pasture", "Das ist die Wiese.", "places"],
  ["", "wieso", "adverb", "why / how come", "Ich mache das wieso.", "adverb"],
  ["der", "Wind", "noun", "wind", "Das ist der Wind.", "other"],
  ["", "windig", "adjective", "windy / breezy", "Das ist windig.", "adjective"],
  ["", "winken", "verb", "to wave", "Ich möchte winken.", "verb"],
  ["", "wirken", "verb", "to take effect / work / seem", "Ich möchte wirken.", "verb"],
  ["die", "Wirkung", "noun", "effect / impact", "Das ist die Wirkung.", "other"],
  ["", "wirklich", "adjective", "real / really / actually", "Das ist wirklich.", "adjective"],
  ["die", "Wirklichkeit", "noun", "reality / fact", "Das ist die Wirklichkeit.", "other"],
  ["der", "Wirt", "noun", "innkeeper / landlord / host", "Das ist der Wirt.", "people"],
  ["die", "Wirtschaft", "noun", "economy / economics", "Das ist die Wirtschaft.", "other"],
  ["das", "Wissen", "noun", "knowledge", "Das ist das Wissen.", "other"],
  ["die", "Wissenschaft", "noun", "science / scholarship", "Das ist die Wissenschaft.", "other"],
  ["der", "Wissenschaftler", "noun", "scientist (male)", "Das ist der Wissenschaftler.", "professions"],
  ["die", "Wissenschaftlerin", "noun", "scientist (female)", "Das ist die Wissenschaftlerin.", "professions"],
  ["der", "Witz", "noun", "joke", "Das ist der Witz.", "other"],
  ["", "wohl", "adverb", "well / probably", "Ich mache das wohl.", "adverb"],
  ["die", "Wohnung", "noun", "apartment / flat", "Das ist die Wohnung.", "house"],
  ["das", "Wohnzimmer", "noun", "living room", "Das Wohnzimmer ist hell.", "house"],
  ["die", "Wolke", "noun", "cloud", "Das ist die Wolke.", "other"],
  ["", "bewölkt", "adjective", "cloudy / overcast", "Das ist bewölkt.", "adjective"],
  ["die", "Wolle", "noun", "wool", "Das ist die Wolle.", "clothing"],
  ["", "wollen", "verb", "to want / intend", "Ich will Deutsch lernen.", "verb"],
  ["das", "Wort", "noun", "word", "Das ist das Wort.", "stationery"],
  ["das", "Wörterbuch", "noun", "dictionary", "Das ist das Wörterbuch.", "stationery"],
  ["die", "Wunde", "noun", "wound / cut", "Das ist die Wunde.", "body"],
  ["das", "Wunder", "noun", "wonder / miracle", "Das ist das Wunder.", "other"],
  ["", "wunderbar", "adjective", "wonderful / marvelous", "Das ist wunderbar.", "adjective"],
  ["", "wunderschön", "adjective", "gorgeous / beautiful", "Das ist wunderschön.", "adjective"],
  ["", "sich wundern", "verb", "to be surprised / wonder", "Ich möchte sich wundern.", "verb"],
  ["", "wünschen", "verb", "to wish / desire", "Ich möchte wünschen.", "verb"],
  ["der", "Wunsch", "noun", "wish / desire", "Das ist der Wunsch.", "other"],
  ["die", "Wurst", "noun", "sausage", "Das ist die Wurst.", "food"],
  ["", "wütend", "adjective", "furious / angry", "Das ist wütend.", "adjective"],
  ["die", "Zahl", "noun", "number / figure", "Das ist die Zahl.", "other"],
  ["", "zahlreich", "adjective", "numerous / countless", "Das ist zahlreich.", "adjective"],
  ["die", "Zahlung", "noun", "payment", "Das ist die Zahlung.", "other"],
  ["", "zählen", "verb", "to count", "Ich möchte zählen.", "verb"],
  ["der", "Zahn", "noun", "tooth", "Das ist der Zahn.", "body"],
  ["die", "Zahnbürste", "noun", "toothbrush", "Das ist die Zahnbürste.", "house"],
  ["die", "Zahncreme", "noun", "toothpaste", "Das ist die Zahncreme.", "house"],
  ["die", "Zange", "noun", "pliers / tongs", "Das ist die Zange.", "house"],
  ["das", "Zeichen", "noun", "sign / signal / symbol", "Das ist das Zeichen.", "other"],
  ["das", "Verkehrszeichen", "noun", "traffic sign / road sign", "Das ist das Verkehrszeichen.", "transport"],
  ["", "zeichnen", "verb", "to draw / sketch", "Ich möchte zeichnen.", "verb"],
  ["die", "Zeichnung", "noun", "drawing / sketch", "Das ist die Zeichnung.", "stationery"],
  ["", "zeigen", "verb", "to show / point out", "Ich möchte zeigen.", "verb"],
  ["die", "Zeile", "noun", "line (of text)", "Das ist die Zeile.", "stationery"],
  ["die", "Zeit", "noun", "time", "Ich habe heute Zeit.", "time"],
  ["der", "Zeitpunkt", "noun", "point in time / moment", "Das ist der Zeitpunkt.", "time"],
  ["", "zurzeit", "adverb", "at present / currently", "Ich arbeite zurzeit.", "time"],
  ["die", "Zeitschrift", "noun", "magazine / periodical", "Das ist die Zeitschrift.", "stationery"],
  ["die", "Zeitung", "noun", "newspaper", "Das ist die Zeitung.", "stationery"],
  ["das", "Zelt", "noun", "tent", "Das ist das Zelt.", "places"],
  ["", "zelten", "verb", "to camp (in tent)", "Ich möchte zelten.", "verb"],
  ["", "zentral", "adjective", "central", "Das ist zentral.", "adjective"],
  ["das", "Zentrum", "noun", "center / downtown", "Das ist das Zentrum.", "places"],
  ["", "zerstören", "verb", "to destroy / ruin", "Ich möchte zerstören.", "verb"],
  ["das", "Zertifikat", "noun", "certificate", "Das ist das Zertifikat.", "stationery"],
  ["der", "Zettel", "noun", "slip of paper / note", "Das ist der Zettel.", "stationery"],
  ["das", "Zeugnis", "noun", "report / certificate / reference", "Das ist das Zeugnis.", "stationery"],
  ["", "ziehen", "verb", "to pull / move (residence)", "Ich ziehe die Jacke an.", "verb"],
  ["das", "Ziel", "noun", "goal / target / destination", "Das ist das Ziel.", "other"],
  ["", "ziemlich", "adverb", "quite / fairly / rather", "Ich mache das ziemlich.", "adverb"],
  ["die", "Zigarette", "noun", "cigarette", "Das ist die Zigarette.", "other"],
  ["das", "Zimmer", "noun", "room", "Das ist das Zimmer.", "house"],
  ["die", "Zinsen", "noun", "interest (finance)", "Das ist die Zinsen.", "other"],
  ["der", "Zirkus", "noun", "circus", "Das ist der Zirkus.", "places"],
  ["die", "Zitrone", "noun", "lemon", "Das ist die Zitrone.", "food"],
  ["der", "Zoll", "noun", "customs / duty", "Das ist der Zoll.", "places"],
  ["", "zubereiten", "verb", "to prepare (food)", "Ich möchte zubereiten.", "verb"],
  ["der", "Zucker", "noun", "sugar", "Ich brauche Zucker.", "food"],
  ["", "zuerst", "adverb", "first / at first", "Ich mache das zuerst.", "adverb"],
  ["der", "Zufall", "noun", "coincidence / chance", "Das ist der Zufall.", "other"],
  ["", "zufällig", "adjective", "by chance / accidental", "Das ist zufällig.", "adjective"],
  ["", "zufrieden", "adjective", "satisfied / content / pleased", "Das ist zufrieden.", "adjective"],
  ["der", "Zugang", "noun", "access / entrance", "Das ist der Zugang.", "places"],
  ["", "zugänglich", "adjective", "accessible / approachable", "Das ist zugänglich.", "adjective"],
  ["der", "Zug", "noun", "train", "Der Zug kommt.", "transport"],
  ["", "zugehen", "verb", "to close / shut / approach", "Ich möchte zugehen.", "verb"],
  ["das", "Zuhause", "noun", "home", "Das ist das Zuhause.", "house"],
  ["", "zuhören", "verb", "to listen (attentively)", "Ich möchte zuhören.", "verb"],
  ["der", "Zuhörer", "noun", "listener / audience member", "Das ist der Zuhörer.", "people"],
  ["die", "Zukunft", "noun", "future", "Das ist die Zukunft.", "time"],
  ["", "zukünftig", "adjective", "future / in future", "Das ist zukünftig.", "adjective"],
  ["", "zuletzt", "adverb", "last / finally / at last", "Ich mache das zuletzt.", "adverb"],
  ["", "zumachen", "verb", "to close / shut", "Ich möchte zumachen.", "verb"],
  ["", "zumindest", "adverb", "at least", "Ich mache das zumindest.", "adverb"],
  ["", "zunächst", "adverb", "first / for the time being", "Ich mache das zunächst.", "adverb"],
  ["", "zunehmen", "verb", "to increase / gain weight", "Ich möchte zunehmen.", "verb"],
  ["", "zurechtkommen", "verb", "to cope / manage / get by", "Ich möchte zurechtkommen.", "verb"],
  ["", "zusagen", "verb", "to accept (invitation) / confirm", "Ich möchte zusagen.", "verb"],
  ["", "zusammen", "adverb", "together / altogether", "Wir lernen zusammen.", "adverb"],
  ["die", "Zusammenarbeit", "noun", "cooperation / collaboration", "Das ist die Zusammenarbeit.", "other"],
  ["", "zusammenfassen", "verb", "to summarize / sum up", "Ich möchte zusammenfassen.", "verb"],
  ["der", "Zusammenhang", "noun", "connection / context", "Das ist der Zusammenhang.", "other"],
  ["", "zusätzlich", "adjective", "additional / supplementary", "Das ist zusätzlich.", "adjective"],
  ["", "zuschauen", "verb", "to watch / look on", "Ich möchte zuschauen.", "verb"],
  ["der", "Zuschauer", "noun", "spectator / viewer", "Das ist der Zuschauer.", "people"],
  ["der", "Zuschlag", "noun", "surcharge / extra charge", "Das ist der Zuschlag.", "other"],
  ["der", "Zustand", "noun", "condition / state", "Das ist der Zustand.", "other"],
  ["", "zuständig", "adjective", "responsible / in charge", "Das ist zuständig.", "adjective"],
  ["", "zustimmen", "verb", "to agree / consent", "Ich möchte zustimmen.", "verb"],
  ["die", "Zustimmung", "noun", "consent / approval / agreement", "Das ist die Zustimmung.", "other"],
  ["die", "Zutaten", "noun", "ingredients", "Das ist die Zutaten.", "food"],
  ["", "zuverlässig", "adjective", "reliable / dependable", "Das ist zuverlässig.", "adjective"],
  ["", "zwar", "other", "indeed / to be sure", "Ich lerne das Wort „zwar“.", "other"],
  ["der", "Zweck", "noun", "purpose / aim", "Das ist der Zweck.", "other"],
  ["", "zweifeln", "verb", "to doubt", "Ich möchte zweifeln.", "verb"],
  ["der", "Zweifel", "noun", "doubt", "Das ist der Zweifel.", "other"],
  ["die", "Zwiebel", "noun", "onion", "Das ist die Zwiebel.", "food"],
  ["", "zwingen", "verb", "to force / compel", "Ich möchte zwingen.", "verb"],
  ["", "zwischen", "other", "between / among", "Der Stuhl steht zwischen dem Tisch und dem Sofa.", "other"],
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
function pickSmartWord(source, stats, excludeId) {
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

  const canIntroduceNew = brandNew.length > 0 && stats.newWordsToday < stats.newWordCap;
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
    })();
    unsubscribe = onAuthChange((_event, user) => setAuthUser(user));
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
        <div>
          <h1 className="vh-title" style={styles.title}>Vokabelheft</h1>
          <p className="vh-subtitle" style={styles.subtitle}>{vocabCount}+ words · your own pace</p>
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

function AccountControl({ authUser, syncState, onOpenAuth, onLogout }) {
  if (!authUser) {
    return (
      <button className="vh-btn" onClick={onOpenAuth} style={styles.accountBtn} type="button">
        <User size={14} /> Log in
      </button>
    );
  }

  const label = authUser.userMetadata?.full_name || authUser.email;
  const syncIcon =
    syncState === "syncing" ? (
      <Loader2 size={13} className="vh-spin" />
    ) : syncState === "error" ? (
      <CloudOff size={13} color="#B5443B" />
    ) : (
      <Cloud size={13} color="#4F8A66" />
    );
  const syncTitle = syncState === "syncing" ? "Syncing your profile…" : syncState === "error" ? "Couldn't sync — will retry" : "Profile synced";

  return (
    <div className="vh-account" style={styles.accountWrap} title={label}>
      <span style={styles.accountName}>
        {syncIcon} {label}
      </span>
      <button className="vh-btn" onClick={onLogout} style={styles.iconToggle} title="Log out" type="button">
        <LogOut size={14} />
      </button>
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
      const target = pool === "all" ? pickSmartWord(source, stats, excludeId) : source.length ? source[Math.floor(Math.random() * source.length)] : null;
      if (!target) return null;
      const targetKey = englishKey(target.en);
      const others = shuffle(
        allVocab.filter((w) => w.id !== target.id && englishKey(w.en) !== targetKey)
      ).slice(0, 5);
      return { target, options: shuffle([target, ...others]) };
    },
    [pool, filteredPoolWords, allVocab, stats]
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
      return pool === "all" ? pickSmartWord(source, stats, excludeId) : source[Math.floor(Math.random() * source.length)];
    },
    [pool, filteredPoolWords, stats]
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
  const now = Date.now();
  const due = source.filter((w) => {
    const s = stats.wordStats[w.id];
    return s && s.seen > 0 && (s.dueAt || 0) <= now;
  });
  due.sort((a, b) => {
    const sa = stats.wordStats[a.id];
    const sb = stats.wordStats[b.id];
    const pa = isProblem(sa) ? 0 : 1;
    const pb = isProblem(sb) ? 0 : 1;
    if (pa !== pb) return pa - pb;
    return (sa.dueAt || 0) - (sb.dueAt || 0);
  });
  const newWordsRemaining = Math.max(0, (stats.newWordCap || 0) - (stats.newWordsToday || 0));
  const brandNew = source
    .filter((w) => {
      const s = stats.wordStats[w.id];
      return !s || s.seen === 0;
    })
    .sort((a, b) => source.indexOf(a) - source.indexOf(b))
    .slice(0, newWordsRemaining);
  const usedIds = new Set([...due, ...brandNew].map((w) => w.id));
  const rest = shuffle(source.filter((w) => !usedIds.has(w.id)));
  return [...due, ...brandNew, ...rest].slice(0, Math.min(size, source.length));
}

function scoreEmoji(pct) {
  if (pct >= 90) return { emoji: "🏆", text: "Zabardast! Bilkul on point." };
  if (pct >= 70) return { emoji: "🎉", text: "Bahut badiya, keep going." };
  if (pct >= 50) return { emoji: "🙂", text: "Achha start — thoda aur practice." };
  return { emoji: "😅", text: "Koi baat nahi, dobara try karo." };
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
      <div className="vh-card" style={styles.card}>
        <h2 style={styles.sectionTitle}>Group practice</h2>
        <p style={styles.helperText}>Fill in a whole batch of words at once, then submit together and see your score.</p>

        <div style={styles.settingsRow}>
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

        <div style={{ marginTop: 4, marginBottom: 18 }}>
          <div style={{ ...styles.settingsLabel, marginBottom: 8 }}>Direction</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="vh-btn" style={{ ...styles.dirBtn, ...(direction === "de-en" ? styles.dirBtnActive : {}) }} onClick={() => setDirection("de-en")}>
              German → English
            </button>
            <button className="vh-btn" style={{ ...styles.dirBtn, ...(direction === "en-de" ? styles.dirBtnActive : {}) }} onClick={() => setDirection("en-de")}>
              English → German
            </button>
          </div>
        </div>

        {locked ? (
          <p style={{ ...styles.helperText, color: "#B5443B" }}>No attempts remaining today. Your daily attempts reset tomorrow.</p>
        ) : source.length === 0 ? (
          <p style={styles.helperText}>No words in this category yet.</p>
        ) : (
          <button style={styles.checkBtn} className="vh-btn" onClick={start}>
            Start batch ({Math.min(size, source.length)} words) →
          </button>
        )}
      </div>
    );
  }

  if (phase === "quiz") {
    const filledCount = batch.filter((w) => (answers[w.id] || "").trim().length > 0).length;
    return (
      <div className="vh-card" style={styles.card}>
        <div style={styles.batchProgress}>
          <span>
            {direction === "de-en" ? "German → English" : "English → German"} · {filledCount} of {batch.length} filled
          </span>
          <div style={styles.progressTrack}>
            <div style={{ ...styles.progressFill, width: `${(filledCount / batch.length) * 100}%`, background: "#D4A94F" }} />
          </div>
        </div>

        <div style={styles.worksheetList}>
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
    <div className="vh-card" style={{ ...styles.card, textAlign: "center" }}>
      <div style={{ fontSize: 52, marginBottom: 4, animation: "vhPop .4s ease" }}>{emoji}</div>
      <div style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 700, color: "#1F2A44" }}>
        Your score: {correctCount}/{results.length} ({pct}%)
      </div>
      <div style={{ color: "#8A8474", fontSize: 13.5, marginTop: 4, marginBottom: 18 }}>{text}</div>

      <div style={{ ...styles.worksheetList, textAlign: "left", maxWidth: 520, margin: "0 auto" }}>
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
    problem: "🎉 No problem words right now — sab mastered hai is category me!",
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
    }
    .vh-header-controls {
      gap: 5px !important;
      flex-shrink: 0 !important;
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

  @media (max-width: 480px) {
    .vh-page { padding: 14px 10px 28px !important; }
    .vh-card { border-radius: 15px !important; padding: 38px 13px 16px !important; }
    .vh-panel { padding: 16px !important; }
    .vh-title { font-size: 27px !important; }
    .vh-chip-row { gap: 6px !important; margin-bottom: 14px !important; }
    .vh-chip { font-size: 11.5px !important; padding: 5px 9px !important; }
    .vh-tabs { gap: 6px !important; margin-bottom: 14px !important; }
    .vh-tab-btn { padding: 8px 10px !important; font-size: 12px !important; }
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
    .vh-tab-btn { padding: 7px 8px !important; font-size: 11.5px !important; }
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
  accountWrap: { display: "flex", alignItems: "center", gap: 6 },
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
