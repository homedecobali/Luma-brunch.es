/* Luma Brunch – carta / menu / kaart.
   Bron: luma-brunch.es/menu/menu.json (november 2026).
   Item: [naam ES, naam EN, naam NL, prijs, omschrijving ES, EN, NL, labels]
   Labels: v = vegan, vg = vegetarisch, p = eiwitrijk, fav = favoriet van het huis */
window.LUMA_MENU = [
{id:"cafes",t:["Cafés","Coffee","Koffie"],i:[
["Espresso","Espresso","Espresso","1,50","","","","vg"],
["Cortado","Cortado","Cortado","1,75","","","","vg"],
["Bombón","Bombón","Bombon","1,95","","","","vg"],
["Americano","Americano","Americano","1,75","Grande €2,75","Large €2,75","Groot €2,75","v"],
["Con leche","Café con leche","Con leche","1,95","Grande €3,25","Large €3,25","Groot €3,25","vg"],
["Cappuccino","Cappuccino","Cappuccino","1,95","Grande €3,25","Large €3,25","Groot €3,25","vg"],
["Latte","Latte","Latte","2,25","Espresso con abundante leche","Espresso with plenty of milk","Espresso met veel melk","vg"],
["Flat white","Flat white","Flat white","3,25","Doble espresso y leche","Double espresso with milk","Dubbele espresso en melk","vg"],
["Chai latte","Chai latte","Chai latte","3,50","","","","vg"],
["Dirty chai","Dirty chai","Dirty chai","4,50","","","","vg"],
["Chocolate caliente","Hot chocolate","Warme chocolademelk","3,25","","","","vg"],
["Caramel macchiato","Caramel macchiato","Caramel macchiato","4,25","","","","vg"]
],n:[["Extras: espresso + €1,00 · nata montada + €0,50 · bebida de almendras, avena o leche sin lactosa + €0,30","Extras: espresso + €1,00 · whipped cream + €0,50 · almond, oat or lactose-free milk + €0,30","Extra’s: espresso + €1,00 · slagroom + €0,50 · amandel-, haver- of lactosevrije melk + €0,30"]]},

{id:"iced",t:["Iced latte","Iced latte","Iced latte"],i:[
["Iced latte","Iced latte","Iced latte","3,50","Doble espresso, leche y hielo. Caramelo, vainilla o banana + €1,00","Double espresso, milk and ice. Caramel, vanilla or banana + €1,00","Dubbele espresso, melk en ijs. Karamel, vanille of banaan + €1,00","vg"],
["Iced matcha latte","Iced matcha latte","Iced matcha latte","3,95","","","","vg"],
["Iced dirty chai","Iced dirty chai","Iced dirty chai","4,95","","","","vg"]
],n:[["Nata montada + €1,00 · espresso + €0,50 · bebida de almendras, avena o leche sin lactosa + €0,30","Whipped cream + €1,00 · espresso + €0,50 · almond, oat or lactose-free milk + €0,30","Slagroom + €1,00 · espresso + €0,50 · amandel-, haver- of lactosevrije melk + €0,30"]]},

{id:"matcha",t:["Matcha","Matcha","Matcha"],i:[
["Matcha latte","Matcha latte","Matcha latte","3,50","","","","vg"],
["Iced matcha latte","Iced matcha latte","Iced matcha latte","3,95","","","","vg"]
],n:[["Mango, fresa, banana o vainilla + €1,00","Mango, strawberry, banana or vanilla + €1,00","Mango, aardbei, banaan of vanille + €1,00"]]},

{id:"tes",t:["Tés","Tea","Thee"],i:[
["Té","Tea","Thee","1,75","","","","v"],
["Té de menta fresca","Fresh mint tea","Verse muntthee","1,95","Jengibre o limón + €0,25","Ginger or lemon + €0,25","Gember of citroen + €0,25","v"]
],n:[]},

{id:"smoothies",t:["Smoothies","Smoothies","Smoothies"],i:[
["Green Dreams","Green Dreams","Green Dreams","5,95","Espinacas, aguacate, kiwi, banana y bebida de coco.","Spinach, avocado, kiwi, banana and coconut milk.","Spinazie, avocado, kiwi, banaan, kokosmelk.","v"],
["Good Vibes","Good Vibes","Good Vibes","5,95","Mango, piña, papaya, banana y bebida de coco.","Mango, pineapple, papaya, banana and coconut milk.","Mango, ananas, papaya, banaan en kokosmelk.","v"],
["Pink Dragon","Pink Dragon","Pink Dragon","6,95","Pitaya, mango, fresa, banana y bebida de coco.","Dragon fruit, mango, strawberry, banana and coconut milk.","Dragonfruit, mango, aardbei, banaan en kokosmelk.","v fav"],
["Berry Licious","Berry Licious","Berry Licious","6,95","Mezcla de frutos rojos, banana y bebida de coco.","Mixed berries, banana and coconut milk.","Mix van rood fruit, banaan en kokosmelk.","v"],
["Choco Loco","Choco Loco","Choco Loco","6,95","Banana, crema de cacahuete, cacao, copos de avena, sirope de agave y bebida de almendras.","Banana, peanut butter, cocoa, oats, agave syrup and almond milk.","Banaan, pindakaas, cacao, havermout, agavesiroop en amandelmelk.","v"],
["Antiox","Antiox","Antiox","5,95","Naranja, kiwi y fresa.","Orange, kiwi and strawberry.","Sinaasappel, kiwi en aardbei.","v"],
["Stranana","Stranana","Stranana","4,95","Banana, fresa y bebida de coco.","Banana, strawberry and coconut milk.","Banaan, aardbei en kokosmelk.","v"],
["Batido de proteínas","Protein shake","Proteïneshake","7,95","Banana, proteína de vainilla, bebida de almendras, copos de avena y canela.","Banana, vanilla protein, almond milk, oats and cinnamon.","Banaan, vanilleproteïne, amandelmelk, havermout en kaneel.","p"]
],n:[["Bebida de coco, de avena o de almendras.","Coconut, oat or almond milk.","Kokosmelk, havermelk en amandelmelk."],["Proteína extra + €1,00","Extra protein + €1,00","Extra proteïne + €1,00"]]},

{id:"bowls",t:["Bowls","Bowls","Bowls"],i:[
["Snicker Bowl","Snicker Bowl","Snicker Bowl","7,95","Banana, cacao, sirope de agave, crema de cacahuete y bebida de almendras. Toppings: granola, chía, nueces, banana y trocitos de chocolate.","Banana, cocoa, agave syrup, peanut butter and almond milk. Toppings: granola, chia seeds, walnuts, banana and chocolate chips.","Banaan, cacao, agavesiroop, pindakaas en amandelmelk. Topping: granola, chiazaad, walnoten, banaan en chocoladestukjes.","vg"],
["Pink Dragon","Pink Dragon","Pink Dragon","8,95","Pitaya, banana, mango, fresa y bebida de coco. Toppings: kiwi, chía, arándanos, frambuesas, banana, coco y granola.","Dragon fruit, banana, mango, strawberry and coconut milk. Toppings: kiwi, chia seeds, blueberries, raspberries, banana, coconut and granola.","Dragonfruit, banaan, mango, aardbei en kokosmelk. Topping: kiwi, chiazaad, blauwe bessen, framboos, banaan, kokos en granola.","v fav"],
["Sunshine Bowl","Sunshine Bowl","Sunshine Bowl","7,95","Banana, mango, bebida de almendras y piña. Toppings: granola, chía, frambuesas, banana y arándanos.","Banana, mango, almond milk and pineapple. Toppings: granola, chia seeds, raspberries, banana and blueberries.","Banaan, mango, amandelmelk en ananas. Topping: granola, chiazaad, framboos, banaan en blauwe bessen.","v"],
["Açaí Bowl","Açaí Bowl","Açaí Bowl","8,95","Açaí, banana, fresa y bebida de almendras. Toppings: granola, arándanos, chía, banana y fresa.","Açaí, banana, strawberry and almond milk. Toppings: granola, blueberries, chia seeds, banana and strawberry.","Açaibessen, banaan, aardbei en amandelmelk. Topping: granola, blauwe bessen, chiazaad, banaan en aardbei.","v fav"],
["Bowl de yogur","Yoghurt bowl","Yoghurtbowl","6,95","Yogur griego, fruta fresca, chía, granola y miel. (Yogur de coco + €1,00)","Greek yoghurt, fruit, chia seeds, granola and honey. (Coconut yoghurt + €1,00)","Griekse yoghurt, vers fruit, chiazaad, granola en honing. (Kokosyoghurt + €1,00)","vg p"],
["Bowl de avena","Porridge bowl","Havermoutbowl","5,95","Copos de avena calientes con canela, pasas y manzana caramelizada.","Warm porridge with cinnamon, raisins and caramelised apple.","Warme havermout met kaneel, rozijnen en gekaramelliseerde appel.","vg"]
],n:[["Proteína de vainilla + €1,00","Vanilla protein + €1,00","Proteïne (vanille) + €1,00"]]},

{id:"zumos",t:["Zumos naturales","Fresh juices","Verse sappen"],i:[
["Zumo de naranja natural","Fresh orange juice","Vers sinaasappelsap","3,50","","","","v"],
["Heart Beet","Heart Beet","Heart Beet","4,95","Manzana, remolacha, jengibre y limón.","Apple, beetroot, ginger and lemon.","Appel, rode biet, gember en citroen.","v"],
["Green Power","Green Power","Green Power","4,95","Manzana, espinacas, pepino y lima.","Apple, spinach, cucumber and lime.","Appel, spinazie, komkommer en limoen.","v"],
["Celery Juice","Celery Juice","Celery Juice","4,95","Apio, manzana, limón y jengibre.","Celery, apple, lemon and ginger.","Selderij, appel, citroen en gember.","v"],
["Orange Ginger","Orange Ginger","Orange Ginger","4,95","Manzana, zanahoria, naranja, lima y jengibre.","Apple, carrot, orange, lime and ginger.","Appel, wortel, sinaasappel, limoen en gember.","v"],
["Ginger Boost","Ginger Boost","Ginger Boost","4,95","Manzana, piña, jengibre, cúrcuma y pimienta negra.","Apple, pineapple, ginger, turmeric and black pepper.","Appel, ananas, gember, kurkuma en zwarte peper.","v"],
["Tropical Feels","Tropical Feels","Tropical Feels","4,95","Fresas, piña, naranja y manzana.","Strawberries, pineapple, orange and apple.","Aardbeien, ananas, sinaasappel en appel.","v"],
["Shots","Shots","Shots","2,50","Manzana, jengibre y limón. (+ cúrcuma y pimienta negra €0,25)","Apple, ginger and lemon. (Add turmeric and black pepper + €0,25)","Appel, gember en citroen. (+ kurkuma en zwarte peper €0,25)","v"]
],n:[]},

{id:"desayuno",t:["Desayuno","Breakfast","Ontbijt"],i:[
["Desayuno","Breakfast","Ontbijt","9,95","Café o té (con leche, americano, cappuccino o latte) + zumo de naranja natural + croissant con huevos revueltos y un topping a elegir: bacon, queso o aguacate.","Coffee or tea (café con leche, Americano, cappuccino or latte) + fresh orange juice + croissant with scrambled eggs and a topping of your choice: bacon, cheese or avocado.","Koffie of thee (koffie met melk, americano, cappuccino of latte) + vers sinaasappelsap + croissant met roerei en een topping naar keuze: bacon, kaas of avocado.",""]
],n:[]},

{id:"tostadas-especiales",t:["Tostadas especiales","Speciality toast","Speciale toasts"],i:[
["Green Egg","Green Egg","Green Egg","4,95","Pan tostado con aguacate, rúcula, huevo cocido y chía. (+ salmón ahumado €3,95 o jamón ibérico €3,25)","Toasted bread with avocado, rocket, boiled egg and chia seeds. (Add smoked salmon + €3,95 or Iberian ham + €3,25)","Geroosterd brood met avocado, rucola, gekookt ei en chiazaad. (+ gerookte zalm €3,95 of Iberische ham €3,25)","vg p"],
["Smashed Avocado","Smashed Avocado","Smashed avocado","4,95","Pan tostado con aguacate machacado, rúcula, tomate, brotes de alfalfa y semillas. (+ huevo cocido €1,00)","Toasted bread with smashed avocado, rocket, tomato, alfalfa sprouts and mixed seeds. (Boiled egg + €1,00)","Geroosterd brood met geprakte avocado, rucola, tomaat, alfalfa en zadenmix. (+ gekookt ei €1,00)","v"],
["Queso manchego","Manchego cheese","Manchego kaas","7,25","Pan tostado con tomate rallado, rúcula, manchego curado, nueces, tomate seco y un toque de vinagre balsámico.","Toasted bread with grated tomato, rocket, mature Manchego, walnuts, sun-dried tomato and a drizzle of balsamic vinegar.","Geroosterd brood met geraspte tomaat, rucola, gerijpte Manchego, walnoten, zongedroogde tomaat en een vleugje balsamico.","vg"],
["Post Workout","Post Workout","Post Workout","4,75","Pan tostado con crema de cacahuete, banana, chía, arándanos y miel.","Toasted bread with peanut butter, banana, chia seeds, blueberries and honey.","Geroosterd brood met pindakaas, banaan, chiazaad, blauwe bessen en honing.","vg p"],
["Hummus","Hummus","Hummus","5,95","Pan tostado con hummus, rúcula, tomate, aguacate, brotes de alfalfa y semillas. (Huevo poché + €1,25)","Toasted bread with hummus, rocket, tomato, avocado, alfalfa sprouts and mixed seeds. (Poached egg + €1,25)","Geroosterd brood met hummus, rucola, tomaat, avocado, alfalfa en zadenmix. (Gepocheerd ei + €1,25)","v"],
["Feta","Feta","Feta","6,25","Pan tostado con aguacate machacado, rúcula, queso feta, tomates cherry, brotes de alfalfa y semillas.","Toasted bread with smashed avocado, rocket, feta, cherry tomatoes, alfalfa sprouts and mixed seeds.","Geroosterd brood met geprakte avocado, rucola, feta, cherrytomaten, alfalfa en zadenmix.","vg"],
["Burrata","Burrata","Burrata","5,95","Pan tostado con burrata cremosa, rúcula, tomates secos, nueces y un toque de vinagre balsámico.","Toasted bread with creamy burrata, rocket, sun-dried tomatoes, walnuts and a drizzle of balsamic vinegar.","Geroosterd brood met romige burrata, rucola, zongedroogde tomaten, walnoten en een vleugje balsamico.","vg"],
["Nordic Dream","Nordic Dream","Nordic Dream","9,95","Pan tostado con queso crema a las finas hierbas, salmón ahumado, rúcula, aguacate, huevo poché y copos de chile.","Toasted bread with herb cream cheese, smoked salmon, rocket, avocado, poached egg and chilli flakes.","Geroosterd brood met kruidenroomkaas, gerookte zalm, rucola, avocado, gepocheerd ei en chilivlokken.","p fav"]
],n:[]},

{id:"tostadas",t:["Tostadas","Toast","Tostada’s"],i:[
["Tomate","Tomato","Tomaat","2,00","","","","v"],
["Tomate y queso","Tomato and cheese","Tomaat en kaas","2,75","","","","vg"],
["Queso","Cheese","Kaas","2,50","","","","vg"],
["Manchego curado","Mature Manchego","Gerijpte Manchego","4,25","","","","vg"],
["Jamón ibérico","Iberian ham","Iberische ham","4,25","","","",""],
["Salmón ahumado","Smoked salmon","Gerookte zalm","4,95","","","","p"],
["Huevos revueltos","Scrambled eggs","Roerei","3,95","","","","vg p"],
["Atún","Tuna","Tonijn","2,95","","","","p"],
["Mermelada","Jam","Jam","2,25","","","","v"],
["Mermelada y mantequilla","Jam and butter","Jam en boter","2,50","","","","vg"]
],n:[["Bacon + €1,50 · Aguacate + €1,25 · Huevo cocido + €1,00 · Huevo poché + €1,25","Bacon + €1,50 · Avocado + €1,25 · Boiled egg + €1,00 · Poached egg + €1,25","Bacon + €1,50 · Avocado + €1,25 · Gekookt ei + €1,00 · Gepocheerd ei + €1,25"],["Elige tu pan: blanco, integral, de molde blanco o integral. Panecillo blanco o brioche + €0,25","Choose your bread: white, wholemeal, white or wholemeal sliced. White roll or brioche + €0,25","Keuze uit brood: witte of volkoren tostada, wit of bruin geroosterd brood. Wit bolletje of brioche + €0,25"]]},

{id:"sandwiches",t:["Sándwiches","Toasties","Tosti’s"],i:[
["Sándwich de queso","Cheese toastie","Tosti met kaas","3,95","","","","vg"],
["Sándwich de tomate y queso","Tomato and cheese toastie","Tosti met tomaat en kaas","4,25","","","","vg"],
["Sándwich de queso y cebolla","Cheese and onion toastie","Tosti met kaas en ui","3,95","","","","vg"],
["Sándwich de tomate y pesto","Tomato and pesto toastie","Tosti met tomaat en pesto","4,50","","","","vg"],
["Sándwich de jamón y queso","Ham and cheese toastie","Tosti met ham en kaas","4,75","","","",""],
["Sándwich de ensalada de atún","Tuna salad toastie","Tosti met tonijnsalade","5,95","","","","p"]
],n:[]},

{id:"croissants",t:["Croissants","Croissants","Croissants"],i:[
["Solo","Plain","Naturel","2,25","","","","vg"],
["Queso","Cheese","Kaas","3,25","","","","vg"],
["Jamón y queso","Ham and cheese","Ham en kaas","3,95","","","",""],
["Mantequilla","Butter","Boter","2,75","","","","vg"],
["Mantequilla y mermelada","Butter and jam","Boter en jam","3,25","","","","vg"],
["Nutella","Nutella","Nutella","2,75","","","","vg"],
["Huevos revueltos","Scrambled eggs","Roerei","4,95","","","","vg p"],
["Salmón ahumado, aguacate y huevo poché","Smoked salmon, avocado and poached egg","Gerookte zalm, avocado en gepocheerd ei","9,50","","","","p"]
],n:[["Bacon + €1,50 · Aguacate + €1,25","Bacon + €1,50 · Avocado + €1,25","Bacon + €1,50 · Avocado + €1,25"]]},

{id:"bagels",t:["Bagels","Bagels","Bagels"],i:[
["Bagel de huevo y bacon","Egg and bacon bagel","Bagel met ei en bacon","5,95","Huevos revueltos y bacon.","Scrambled eggs and bacon.","Roerei en bacon.","p"],
["Bagel BLT","Bagel BLT","Bagel BLT","5,75","Bacon, lechuga, tomate y mayonesa.","Bacon, lettuce, tomato and mayonnaise.","Bacon, sla, tomaat en mayonaise.",""],
["Bagel de hummus","Hummus bagel","Bagel hummus","5,50","Hummus, tomate, pepino, rúcula, cebolla roja y brotes de alfalfa.","Hummus, tomato, cucumber, rocket, red onion and alfalfa sprouts.","Hummus, tomaat, komkommer, rucola, rode ui en alfalfa.","v"],
["Bagel de salmón y queso crema","Salmon and cream cheese bagel","Bagel met zalm en kruidenroomkaas","9,25","Salmón ahumado, queso crema a las finas hierbas, rúcula y cebolla roja.","Smoked salmon, herb cream cheese, rocket and red onion.","Gerookte zalm, kruidenroomkaas, rucola en rode ui.","p"],
["Bagel de salmón y huevo poché","Salmon and poached egg bagel","Bagel met zalm en gepocheerd ei","9,50","Salmón ahumado, rúcula, aguacate y huevo poché. (Salsa holandesa + €1,25)","Smoked salmon, rocket, avocado and poached egg. (Hollandaise sauce + €1,25)","Gerookte zalm, rucola, avocado en gepocheerd ei. (Hollandaisesaus + €1,25)","p"],
["Bagel de atún","Tuna bagel","Bagel met tonijn","5,95","Rúcula, ensalada de atún y huevo cocido.","Rocket, tuna salad and boiled egg.","Rucola, tonijnsalade en gekookt ei.","p"]
],n:[]},

{id:"sopas",t:["Sopas","Soups","Soepen"],i:[
["Sopa de pollo","Chicken soup","Kippensoep","5,95","Sopa casera de pollo, servida con pan.","Homemade chicken soup, served with bread.","Huisgemaakte kippensoep, met brood.",""],
["Sopa de lentejas","Lentil soup","Linzensoep","5,95","Sopa casera de lentejas, servida con pan.","Homemade lentil soup, served with bread.","Huisgemaakte linzensoep, met brood.","p"]
],n:[]},

{id:"ensaladas",t:["Ensaladas","Salads","Salades"],i:[
["Ensalada César","Caesar salad","Caesarsalade","9,95","Lechuga iceberg, pepino, pollo, bacon, huevo cocido, parmesano, picatostes y salsa César.","Iceberg lettuce, cucumber, chicken, bacon, boiled egg, Parmesan, croutons and Caesar dressing.","IJsbergsla, komkommer, kip, bacon, gekookt ei, Parmezaanse kaas, croutons en caesardressing.","p"],
["Ensalada Luma","Luma salad","Luma-salade","9,95","Mezcla de lechugas, tomates cherry, pepino, piñones, parmesano, bacon crujiente, cebolla roja y aliño de pesto.","Mixed leaves, cherry tomatoes, cucumber, pine nuts, Parmesan, crispy bacon, red onion and pesto dressing.","Gemengde sla, cherrytomaten, komkommer, pijnboompitten, Parmezaanse kaas, krokante bacon, rode ui en pestodressing.",""],
["Ensalada mixta","Mixed salad","Gemengde salade","8,95","Quinoa, mezcla de lechugas, aguacate, cebolla roja, zanahoria, tomates cherry, aceitunas, pepino y salsa cremosa vegana.","Quinoa, mixed leaves, avocado, red onion, carrot, cherry tomatoes, olives, cucumber and a creamy vegan dressing.","Quinoa, gemengde sla, avocado, rode ui, wortel, cherrytomaten, olijven, komkommer en romige vegan saus.","v"],
["Ensalada de burrata","Burrata salad","Burratasalade","9,95","Burrata cremosa sobre rúcula con tomates cherry, piñones tostados, tomate seco, pesto y aceite de oliva.","Creamy burrata on rocket with cherry tomatoes, toasted pine nuts, sun-dried tomato, pesto and olive oil.","Romige burrata op rucola met cherrytomaten, geroosterde pijnboompitten, zongedroogde tomaat, pesto en olijfolie.","vg"]
],n:[]},

{id:"brunch",t:["Brunch","Brunch","Brunch"],i:[
["Shakshuka","Shakshuka","Shakshuka","7,95","Salsa casera de tomate con pimiento, cebolla y especias, 2 huevos poché y pan. (Feta + €1,25)","Homemade tomato sauce with peppers, onion and spices, 2 poached eggs and bread. (Feta + €1,25)","Huisgemaakte tomatensaus met paprika, ui en kruiden, 2 gepocheerde eieren en brood. (Feta + €1,25)","vg p fav"],
["Luma’s Chicken","Luma’s Chicken","Luma’s Chicken","6,95","Bocadillo de pollo especiado, rúcula y mayonesa de ajo.","Baguette with seasoned chicken, rocket and garlic mayonnaise.","Stokbrood met gekruide kip, rucola en knoflookmayonaise.","p"],
["Spicy Tuna","Spicy Tuna","Spicy tuna","6,75","Bocadillo de ensalada de atún, jalapeños, tomate, huevo cocido y pesto.","Baguette with tuna salad, jalapeños, tomato, boiled egg and pesto.","Stokbrood met tonijnsalade, jalapeño’s, tomaat, gekookt ei en pesto.","p"],
["Carpaccio","Carpaccio","Carpaccio","7,50","Bocadillo de carpaccio, rúcula, parmesano, piñones y pesto o mayonesa de trufa.","Baguette with carpaccio, rocket, Parmesan, pine nuts and pesto or truffle mayonnaise.","Stokbrood met carpaccio, rucola, Parmezaanse kaas, pijnboompitten en pesto of truffelmayonaise.","p"],
["Salmón ahumado","Smoked salmon","Gerookte zalm","9,50","Bocadillo de salmón ahumado, queso crema a las finas hierbas, huevo cocido y rúcula.","Baguette with smoked salmon, herb cream cheese, boiled egg and rocket.","Stokbrood met gerookte zalm, kruidenroomkaas, gekookt ei en rucola.","p"],
["Grillworst","Grillworst","Grillworst","7,25","Bocadillo de salchicha holandesa a la parrilla con salsa de miel y mostaza.","Baguette with grilled Dutch sausage and honey-mustard sauce.","Stokbrood met gegrilde worst en honing-mosterdsaus.",""],
["Albóndiga casera","Homemade meatball","Huisgemaakte gehaktbal","7,25","Bocadillo de albóndiga casera.","Baguette with a homemade meatball.","Stokbrood met een huisgemaakte gehaktbal.",""],
["Brie","Brie","Brie","6,25","Bocadillo de brie caliente, miel, nueces y rúcula.","Baguette with warm brie, honey, walnuts and rocket.","Stokbrood met warme brie, honing, walnoten en rucola.","vg"],
["Spicy Chicken","Spicy Chicken","Spicy chicken","6,95","Bocadillo de pollo desmenuzado en salsa picante y lechuga.","Baguette with pulled chicken in a spicy sauce and lettuce.","Stokbrood met pulled chicken in pittige saus en sla.","p"],
["Jamón y queso especial","Ham and cheese special","Ham-kaas speciaal","6,25","Jamón y queso, lechuga iceberg, tomate, pepino y huevo cocido.","Ham and cheese, iceberg lettuce, tomato, cucumber and boiled egg.","Ham en kaas, ijsbergsla, tomaat, komkommer en gekookt ei.",""],
["Sándwich club","Club sandwich","Clubsandwich","8,95","Pan tostado con ensalada de pollo con mayonesa, pepino, tomate, bacon, lechuga iceberg y huevo cocido.","Toasted bread with chicken mayonnaise, cucumber, tomato, bacon, iceberg lettuce and boiled egg.","Geroosterd brood met kip-mayonaisesalade, komkommer, tomaat, bacon, ijsbergsla en gekookt ei.","p"],
["Avocado “Croast”","Avocado “Croast”","Avocado “Croast”","8,95","Croissant tostado con aguacate machacado, rúcula, piñones, huevo poché y parmesano.","Toasted croissant with smashed avocado, rocket, pine nuts, poached egg and Parmesan.","Geroosterde croissant met geprakte avocado, rucola, pijnboompitten, gepocheerd ei en Parmezaanse kaas.","vg"],
["Huevos benedictinos","Eggs Benedict","Eggs Benedict","8,95","Brioche tostado con huevo poché, bacon, aguacate y salsa holandesa.","Toasted brioche with poached egg, bacon, avocado and hollandaise sauce.","Geroosterd briochebrood met gepocheerd ei, bacon, avocado en hollandaisesaus.","p"],
["Huevos benedictinos con salmón","Eggs Benedict with salmon","Eggs Benedict met zalm","9,95","Brioche tostado con huevo poché, salmón ahumado, aguacate y salsa holandesa.","Toasted brioche with poached egg, smoked salmon, avocado and hollandaise sauce.","Geroosterd briochebrood met gepocheerd ei, gerookte zalm, avocado en hollandaisesaus.","p"],
["Flatbread Luma’s Chicken","Flatbread Luma’s Chicken","Flatbread Luma’s Chicken","9,95","Pan plano caliente con Luma’s Chicken, ensalada de pepino, rúcula, cebolla roja y salsa de ajo.","Warm flatbread with Luma’s Chicken, cucumber salad, rocket, red onion and garlic sauce.","Warm flatbread met Luma’s Chicken, komkommersalade, rucola, rode ui en knoflooksaus.","p fav"]
],n:[]},

{id:"dulce",t:["Un capricho dulce","Guilty pleasures","Iets zoets"],i:[
["Tortitas","Pancakes","Pannenkoeken","6,95","Con un topping a elegir: fresas con nata montada · Lotus Biscoff · chocolate blanco · Oreo y sirope de chocolate · Nutella · pistacho y chocolate blanco (+ €1,00) · bacon y sirope de arce (+ €1,50)","With a topping of your choice: strawberries and whipped cream · Lotus Biscoff · white chocolate · Oreo and chocolate syrup · Nutella · pistachio and white chocolate (+ €1,00) · bacon and maple syrup (+ €1,50)","Met topping naar keuze: aardbeien met slagroom · Lotus Biscoff · witte chocolade · Oreo en chocoladesiroop · Nutella · pistache en witte chocolade (+ €1,00) · bacon en ahornsiroop (+ €1,50)","vg fav"],
["Rollo de canela","Cinnamon roll","Kaneelrol","4,75","Rollo de canela casero con glaseado.","Homemade cinnamon roll with icing.","Huisgemaakte kaneelrol met glazuur.","vg"]
],n:[]},

{id:"peques",t:["Para los peques","For the little ones","Voor de kleintjes"],i:[
["Limonada de fresa","Strawberry lemonade","Aardbeienlimonade","2,50","Vasito de limonada de fresa.","Small glass of strawberry lemonade.","Glaasje aardbeienlimonade.","v"],
["Platito de fruta fresca","Fresh fruit plate","Vers fruitbordje","5,50","Platito de fruta de temporada.","A small plate of seasonal fruit.","Bordje met seizoensfruit.","v"],
["Bowl de yogur","Yoghurt bowl","Yoghurtbowl","4,95","Fresa · banana · granola · frambuesa · arándanos · miel","Strawberry · banana · granola · raspberry · blueberry · honey","Aardbei · banaan · granola · framboos · blauwe bessen · honing","vg"],
["Tortitas para el pequeño chef","Pancakes for the little chef","Pannenkoeken voor de kleine chef","6,50","3 tortitas con cuencos de distintos toppings para crear tu combinación favorita.","3 pancakes with little bowls of toppings to create your favourite combination.","3 pannenkoeken met bakjes toppings om zelf je favoriete combinatie te maken.","vg"]
],n:[["Disponible exclusivamente para niños.","Available for children only.","Uitsluitend voor kinderen."]]}
];
