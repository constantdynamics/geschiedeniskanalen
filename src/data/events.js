const events = [
  // Oude beschavingen
  { id: 1, title: 'Bouw van de Piramides van Gizeh', start: -2580, end: -2560, category: 'kunst', region: 'afrika', description: 'De Grote Piramide van Gizeh werd gebouwd als grafmonument voor farao Cheops. Het is een van de Zeven Wereldwonderen van de Oudheid.' },
  { id: 2, title: 'Opkomst van het Romeinse Rijk', start: -753, end: 476, category: 'leiders', region: 'europa', description: 'Van de stichting van Rome tot de val van het West-Romeinse Rijk. Rome domineerde het Middellandse Zeegebied eeuwenlang.' },
  { id: 3, title: 'Griekse Klassieke Periode', start: -500, end: -323, category: 'kunst', region: 'europa', description: 'De bloeiperiode van het oude Griekenland met filosofen als Socrates, Plato en Aristoteles, en de bouw van het Parthenon.' },
  { id: 4, title: 'Alexander de Grote verovert Perzië', start: -334, end: -323, category: 'leiders', region: 'azie', description: 'Alexander de Grote creëerde een van de grootste rijken in de geschiedenis, van Griekenland tot India.' },
  { id: 5, title: 'Chinese Muur - eerste bouw', start: -700, end: -206, category: 'kunst', region: 'azie', description: 'De eerste delen van de Chinese Muur werden gebouwd om het Chinese Rijk te beschermen tegen invasies vanuit het noorden.' },

  // Middeleeuwen
  { id: 6, title: 'Val van het West-Romeinse Rijk', start: 476, end: 476, category: 'oorlogen', region: 'europa', description: 'Romulus Augustulus, de laatste West-Romeinse keizer, werd afgezet. Dit markeert traditioneel het begin van de Middeleeuwen.' },
  { id: 7, title: 'Opkomst van de Islam', start: 610, end: 750, category: 'leiders', region: 'azie', description: 'Mohammed ontving zijn eerste openbaringen en de Islam verspreidde zich snel over het Midden-Oosten en Noord-Afrika.' },
  { id: 8, title: 'Karel de Grote - Frankisch Rijk', start: 768, end: 814, category: 'leiders', region: 'europa', description: 'Karel de Grote werd koning der Franken en later keizer van het Heilige Roomse Rijk, en verenigide grote delen van West-Europa.' },
  { id: 9, title: 'Vikingtijd', start: 793, end: 1066, category: 'oorlogen', region: 'europa', description: 'Scandinavische Vikingen ondernamen plundertochten, handelsreizen en kolonisatie door heel Europa en daarbuiten.' },
  { id: 10, title: 'Kruistochten', start: 1096, end: 1291, category: 'oorlogen', region: 'europa', description: 'Reeks religieuze oorlogen gesteund door de Latijnse Kerk om het Heilige Land te heroveren op de moslims.' },
  { id: 11, title: 'Magna Carta ondertekend', start: 1215, end: 1215, category: 'leiders', region: 'europa', description: 'Koning Jan van Engeland ondertekende de Magna Carta, een mijlpaal in de ontwikkeling van constitutionele rechten.' },
  { id: 12, title: 'Zwarte Dood in Europa', start: 1347, end: 1353, category: 'personen', region: 'europa', description: 'De pest doodde naar schatting 75-200 miljoen mensen in Europa en veranderde de samenleving fundamenteel.' },
  { id: 13, title: 'Mongoolse Rijk', start: 1206, end: 1368, category: 'oorlogen', region: 'azie', description: 'Genghis Khan en zijn opvolgers bouwden het grootste aaneengesloten landrijk in de geschiedenis.' },

  // Renaissance & Ontdekkingsreizen
  { id: 14, title: 'Renaissance in Italië', start: 1400, end: 1600, category: 'kunst', region: 'europa', description: 'Culturele wedergeboorte die begon in Italië met meesters als Leonardo da Vinci, Michelangelo en Rafaël.' },
  { id: 15, title: 'Uitvinding van de boekdrukkunst', start: 1440, end: 1440, category: 'uitvindingen', region: 'europa', description: 'Johannes Gutenberg vond de drukpers met beweegbare letters uit, wat een revolutie in kennisverspreiding veroorzaakte.' },
  { id: 16, title: 'Val van Constantinopel', start: 1453, end: 1453, category: 'oorlogen', region: 'europa', description: 'Het Ottomaanse Rijk veroverde Constantinopel, waarmee het Byzantijnse Rijk ten einde kwam.' },
  { id: 17, title: 'Columbus ontdekt Amerika', start: 1492, end: 1492, category: 'ontdekkingen', region: 'amerika', description: 'Christoffel Columbus bereikte de Nieuwe Wereld, wat leidde tot Europese kolonisatie van Amerika.' },
  { id: 18, title: 'Reformatie - Maarten Luther', start: 1517, end: 1648, category: 'personen', region: 'europa', description: 'Luther publiceerde zijn 95 stellingen, wat leidde tot de protestantse Reformatie en religieuze oorlogen in Europa.' },

  // Gouden Eeuw & Verlichting
  { id: 19, title: 'Nederlandse Gouden Eeuw', start: 1588, end: 1672, category: 'economie', region: 'europa', description: 'De Republiek der Zeven Verenigde Nederlanden was een wereldmacht in handel, wetenschap en kunst.' },
  { id: 20, title: 'VOC opgericht', start: 1602, end: 1799, category: 'economie', region: 'europa', description: 'De Verenigde Oost-Indische Compagnie was de eerste naamloze vennootschap en domineerde de Aziatische handel.' },
  { id: 21, title: 'Galileo en de wetenschappelijke revolutie', start: 1609, end: 1687, category: 'uitvindingen', region: 'europa', description: 'Van Galileo\'s telescoop tot Newtons Principia Mathematica - een fundamentele verandering in wetenschappelijk denken.' },
  { id: 22, title: 'Dertigjarige Oorlog', start: 1618, end: 1648, category: 'oorlogen', region: 'europa', description: 'Een van de bloedigste conflicten in de Europese geschiedenis, eindigend met de Vrede van Westfalen.' },
  { id: 23, title: 'Verlichting', start: 1685, end: 1815, category: 'personen', region: 'europa', description: 'Intellectuele beweging met denkers als Voltaire, Rousseau en Kant die rede en individuele rechten benadrukten.' },
  { id: 24, title: 'Rembrandt van Rijn actief', start: 1625, end: 1669, category: 'kunst', region: 'europa', description: 'De Nederlandse meester schilderde De Nachtwacht en talloze andere meesterwerken tijdens de Gouden Eeuw.' },

  // Revoluties
  { id: 25, title: 'Amerikaanse Revolutie', start: 1765, end: 1783, category: 'oorlogen', region: 'amerika', description: 'De dertien koloniën verklaarden zich onafhankelijk van Groot-Brittannië en stichtten de Verenigde Staten.' },
  { id: 26, title: 'Franse Revolutie', start: 1789, end: 1799, category: 'oorlogen', region: 'europa', description: 'De bestorming van de Bastille luidde een periode in van radicale politieke en maatschappelijke verandering in Frankrijk.' },
  { id: 27, title: 'Industriële Revolutie', start: 1760, end: 1840, category: 'uitvindingen', region: 'europa', description: 'Overgang van handmatige productie naar machinale fabricage, beginnend in Groot-Brittannië.' },
  { id: 28, title: 'Napoleon Bonaparte', start: 1799, end: 1815, category: 'leiders', region: 'europa', description: 'Napoleon veroverde grote delen van Europa en voerde belangrijke hervormingen door voordat hij bij Waterloo werd verslagen.' },

  // 19e eeuw
  { id: 29, title: 'Afschaffing slavernij in Brits Rijk', start: 1833, end: 1833, category: 'leiders', region: 'europa', description: 'De Slavery Abolition Act maakte slavernij illegaal in het grootste deel van het Britse Rijk.' },
  { id: 30, title: 'Darwin publiceert On the Origin of Species', start: 1859, end: 1859, category: 'uitvindingen', region: 'europa', description: 'Charles Darwin presenteerde zijn evolutietheorie, een van de meest invloedrijke wetenschappelijke werken ooit.' },
  { id: 31, title: 'Amerikaanse Burgeroorlog', start: 1861, end: 1865, category: 'oorlogen', region: 'amerika', description: 'Conflict tussen de Unie en de Confederatie over slavernij en staatsrechten, met meer dan 600.000 doden.' },
  { id: 32, title: 'Eenwording van Duitsland', start: 1871, end: 1871, category: 'leiders', region: 'europa', description: 'Otto von Bismarck bracht de eenwording van de Duitse staten tot stand onder Pruisisch leiderschap.' },
  { id: 33, title: 'Scramble for Africa', start: 1881, end: 1914, category: 'leiders', region: 'afrika', description: 'Europese mogendheden verdeelden en koloniseerden vrijwel het gehele Afrikaanse continent.' },
  { id: 34, title: 'Uitvinding van de telefoon', start: 1876, end: 1876, category: 'uitvindingen', region: 'amerika', description: 'Alexander Graham Bell patenteerde de telefoon, wat een revolutie in communicatie inluidde.' },

  // 20e eeuw - eerste helft
  { id: 35, title: 'Eerste Wereldoorlog', start: 1914, end: 1918, category: 'oorlogen', region: 'europa', description: 'De Grote Oorlog kostte meer dan 17 miljoen levens en hertekende de kaart van Europa en het Midden-Oosten.' },
  { id: 36, title: 'Russische Revolutie', start: 1917, end: 1917, category: 'oorlogen', region: 'europa', description: 'De bolsjewieken onder Lenin grepen de macht, wat leidde tot de oprichting van de Sovjet-Unie.' },
  { id: 37, title: 'Vrouwenkiesrecht in Nederland', start: 1919, end: 1919, category: 'leiders', region: 'europa', description: 'Nederlandse vrouwen kregen actief kiesrecht na jarenlange strijd van suffragettes.' },
  { id: 38, title: 'Beurskrach en Grote Depressie', start: 1929, end: 1939, category: 'economie', region: 'amerika', description: 'De beurskrach op Wall Street leidde tot de ergste economische crisis van de 20e eeuw.' },
  { id: 39, title: 'Opkomst van het Nazisme', start: 1933, end: 1945, category: 'leiders', region: 'europa', description: 'Adolf Hitler kwam aan de macht in Duitsland en voerde een totalitair regime dat leidde tot de Holocaust en WO II.' },
  { id: 40, title: 'Tweede Wereldoorlog', start: 1939, end: 1945, category: 'oorlogen', region: 'europa', description: 'Het dodelijkste conflict in de menselijke geschiedenis met naar schatting 70-85 miljoen doden wereldwijd.' },
  { id: 41, title: 'Atoombom op Hiroshima', start: 1945, end: 1945, category: 'oorlogen', region: 'azie', description: 'De VS dropte atoombommen op Hiroshima en Nagasaki, wat leidde tot de Japanse capitulatie en het einde van WO II.' },

  // 20e eeuw - tweede helft
  { id: 42, title: 'Onafhankelijkheid van India', start: 1947, end: 1947, category: 'leiders', region: 'azie', description: 'India werd onafhankelijk van het Britse Rijk onder leiding van Mahatma Gandhi en Jawaharlal Nehru.' },
  { id: 43, title: 'Oprichting van de Verenigde Naties', start: 1945, end: 1945, category: 'leiders', region: 'amerika', description: 'Na WO II werd de VN opgericht om internationale vrede en veiligheid te bevorderen.' },
  { id: 44, title: 'Koude Oorlog', start: 1947, end: 1991, category: 'oorlogen', region: 'europa', description: 'Geopolitieke spanning tussen de VS en de Sovjet-Unie die de wereldpolitiek decennialang domineerde.' },
  { id: 45, title: 'Ontdekking van DNA-structuur', start: 1953, end: 1953, category: 'uitvindingen', region: 'europa', description: 'Watson en Crick ontdekten de dubbele helixstructuur van DNA, fundamenteel voor de moderne biologie.' },
  { id: 46, title: 'Eerste mens op de maan', start: 1969, end: 1969, category: 'uitvindingen', region: 'amerika', description: 'Neil Armstrong zette als eerste mens voet op de maan tijdens de Apollo 11-missie.' },
  { id: 47, title: 'Martin Luther King Jr. - burgerrechtenbeweging', start: 1955, end: 1968, category: 'personen', region: 'amerika', description: 'King leidde de Amerikaanse burgerrechtenbeweging en hield zijn beroemde "I Have a Dream"-speech.' },
  { id: 48, title: 'Dekolonisatie van Afrika', start: 1956, end: 1975, category: 'leiders', region: 'afrika', description: 'Tientallen Afrikaanse landen werden onafhankelijk van hun Europese kolonisatoren.' },
  { id: 49, title: 'Val van de Berlijnse Muur', start: 1989, end: 1989, category: 'leiders', region: 'europa', description: 'De val van de Berlijnse Muur symboliseerde het einde van de Koude Oorlog en leidde tot de Duitse hereniging.' },
  { id: 50, title: 'Apartheid eindigt in Zuid-Afrika', start: 1990, end: 1994, category: 'leiders', region: 'afrika', description: 'Nelson Mandela werd vrijgelaten en werd de eerste democratisch gekozen president van Zuid-Afrika.' },

  // Moderne tijd
  { id: 51, title: 'Uitvinding van het World Wide Web', start: 1989, end: 1991, category: 'uitvindingen', region: 'europa', description: 'Tim Berners-Lee ontwikkelde het WWW bij CERN, wat de digitale revolutie inluidde.' },
  { id: 52, title: 'Europese Unie opgericht', start: 1993, end: 1993, category: 'economie', region: 'europa', description: 'Het Verdrag van Maastricht richtte de EU op, met als doel economische en politieke integratie van Europa.' },
  { id: 53, title: 'Aanslagen 11 september', start: 2001, end: 2001, category: 'oorlogen', region: 'amerika', description: 'Terroristische aanslagen op het World Trade Center en Pentagon veranderden het mondiale veiligheidsbeleid fundamenteel.' },
  { id: 54, title: 'iPhone en de smartphone-revolutie', start: 2007, end: 2007, category: 'uitvindingen', region: 'amerika', description: 'Apple introduceerde de iPhone, wat leidde tot een fundamentele verandering in hoe mensen communiceren en informatie consumeren.' },
  { id: 55, title: 'Wereldwijde financiële crisis', start: 2008, end: 2009, category: 'economie', region: 'amerika', description: 'De instorting van de huizenmarkt in de VS veroorzaakte een wereldwijde economische crisis.' },
  { id: 56, title: 'Arabische Lente', start: 2010, end: 2012, category: 'leiders', region: 'afrika', description: 'Golf van protesten en revoluties in de Arabische wereld, beginnend in Tunesië.' },
  { id: 57, title: 'COVID-19 pandemie', start: 2020, end: 2023, category: 'personen', region: 'azie', description: 'Wereldwijde pandemie die miljoenen levens kostte en samenlevingen wereldwijd ontwrichtte.' },

  // Oude beschavingen extra
  { id: 58, title: 'Mesopotamische beschaving', start: -3000, end: -539, category: 'leiders', region: 'azie', description: 'De wieg van de beschaving in het Tweestromenland met de Sumeriërs, Babyloniërs en Assyriërs.' },
  { id: 59, title: 'Egyptische farao\'s - Nieuwe Rijk', start: -1550, end: -1070, category: 'leiders', region: 'afrika', description: 'De machtigste periode van het oude Egypte met farao\'s als Toetanchamon, Hatsjepsoet en Ramses II.' },
  { id: 60, title: 'Boeddha en het Boeddhisme', start: -563, end: -483, category: 'personen', region: 'azie', description: 'Siddhartha Gautama stichtte het Boeddhisme, een van de grote wereldreligies.' },

  // Ontdekkingsreizen extra
  { id: 61, title: 'Vasco da Gama bereikt India', start: 1498, end: 1498, category: 'ontdekkingen', region: 'azie', description: 'De Portugese ontdekkingsreiziger vond de zeeroute naar India, cruciaal voor de Europese handel.' },
  { id: 62, title: 'Magellaan - eerste wereldreis', start: 1519, end: 1522, category: 'ontdekkingen', region: 'amerika', description: 'Ferdinand Magellaan begon de eerste expeditie die de wereld rondzeilde (voltooid door Juan Sebastián Elcano).' },
  { id: 63, title: 'Captain Cook verkent de Stille Oceaan', start: 1768, end: 1779, category: 'ontdekkingen', region: 'oceanie', description: 'James Cook maakte drie reizen naar de Stille Oceaan en bracht Australië en Nieuw-Zeeland in kaart.' },
  { id: 64, title: 'Ontdekking van Australië door Europeanen', start: 1606, end: 1770, category: 'ontdekkingen', region: 'oceanie', description: 'Van Willem Janszoon (1606) tot James Cook die de oostkust claimde voor Groot-Brittannië.' },

  // Aziatische geschiedenis
  { id: 65, title: 'Tang-dynastie in China', start: 618, end: 907, category: 'leiders', region: 'azie', description: 'Beschouwd als een gouden eeuw van de Chinese beschaving met bloei in kunst, literatuur en technologie.' },
  { id: 66, title: 'Meiji-restauratie in Japan', start: 1868, end: 1912, category: 'leiders', region: 'azie', description: 'Japan transformeerde van een feodale samenleving naar een moderne industriële natie.' },

  // Amerika extra
  { id: 67, title: 'Mayabeschaving - klassieke periode', start: 250, end: 900, category: 'kunst', region: 'amerika', description: 'De Maya\'s bouwden indrukwekkende steden met piramides en ontwikkelden geavanceerde astronomie en wiskunde.' },
  { id: 68, title: 'Azteekse Rijk', start: 1325, end: 1521, category: 'leiders', region: 'amerika', description: 'Het Azteekse Rijk domineerde Midden-Mexico tot de Spaanse verovering door Hernán Cortés.' },
  { id: 69, title: 'Incarijk', start: 1438, end: 1533, category: 'leiders', region: 'amerika', description: 'Het grootste rijk in het pre-Columbiaanse Amerika, gecentreerd in de Andes met als hoofdstad Cusco.' },

  // Economie extra
  { id: 70, title: 'Tulpenmanie', start: 1636, end: 1637, category: 'economie', region: 'europa', description: 'De eerste gedocumenteerde speculatieve zeepbel: tulpenbollen bereikten absurde prijzen in de Nederlanden.' },
  { id: 71, title: 'Invoering van de Euro', start: 2002, end: 2002, category: 'economie', region: 'europa', description: 'De Euro werd als fysieke munt ingevoerd in twaalf EU-landen.' },
  { id: 72, title: 'Zijderoute actief', start: -130, end: 1453, category: 'economie', region: 'azie', description: 'Netwerk van handelsroutes dat China verbond met het Middellandse Zeegebied en de uitwisseling van goederen en ideeën bevorderde.' },
];

export default events;
