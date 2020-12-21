let data = {
  govt_type: [
    'a stable monarchy',
    'a first-generation monarchy',
    'a second-generation monarchy',
    'a dictatorship of pure might',
    'a dictatorship of subtler influence',
    'a dual monarchy',
    'an aristocratic oligarchy',
    'an economic oligarchy',
    'an oligarchy with multiple power centers',
    'a republic dominated by the rich',
    'a republic where both rich and poor have influence',
    'an urban democracy',
    'an urban commune',
    'an agrarian democracy',
    'an agrarian commune',
    'a theocracy with visibly present gods',
    'a theocracy whose gods are rarely present',
    'a philosophical theocracy',
    'ruled by the citizen most skilled in {Table: ability}',
    'ruled by those skilled in {Table: ability}',
    '{Special: roll twice}',
    '{Special: roll twice}',
    '{Special: roll twice}',
  ],

  leader_type: [
    '{Table: exalt_type}',
    '{Table: blooded_type}',
    'a mortal sorcerer',
    '{Table: non_mortal_type}',
    'a partner of the Guild',
    'a friend of Three Forks',
    'an ally of Lookshy',
    'a minion of a powerful {Table: exalt_type}',
    'an accomplice of Vaneha',
    'a wealthy mortal',
    'a wealthy mortal',
    'an intelligent mortal',
    'a wise mortal',
    'a charismatic mortal',
    'a beautiful mortal',
    'a cunning mortal',
    'a strong mortal',
    '{Special: roll twice}',
    '{Special: roll twice}',
    '{Special: roll twice}',
  ],

  exalt_type: [
    'an outcaste Air-aspected Dragon-Blood',
    'an outcaste Air-aspected Dragon-Blood',
    'an outcaste Earth-aspected Dragon-Blood',
    'an outcaste Earth-aspected Dragon-Blood',
    'an outcaste Fire-aspected Dragon-Blood',
    'an outcaste Fire-aspected Dragon-Blood',
    'an outcaste Water-aspected Dragon-Blood',
    'an outcaste Water-aspected Dragon-Blood',
    'an outcaste Wood-aspected Dragon-Blood',
    'an outcaste Wood-aspected Dragon-Blood',
    '{Table: exalt_type_other}',
  ],

  exalt_type_other: [
    'a Solar Exalt',
    'a Solar Exalt',
    'a Solar Exalt',
    'an Abyssal Exalt',
    'an Abyssal Exalt',
    'an Infernal Exalt',
    'a Sidereal Exalt',
    'a Sidereal Exalt',
    'a Lunar Exalt',
    'a Lunar Exalt',
    'a Lunar Exalt',
    'a Lunar Exalt',
    'a Lunar Exalt',
    'a Lunar Exalt',
    'a Lunar Exalt',
    'a Lunar Exalt',
    'an Exigent',
    'an Exigent',
    'an Exigent',
    'an Exigent',
  ],

  non_mortal_type: [
    'a god',
    'a god',
    'a god',
    'a god',
    'a god',
    'a god',
    'a god',
    'a god',
    'a god',
    'an Air Elemental',
    'an Earth Elemental',
    'a Fire Elemental',
    'a Water Elemental',
    'a Wood Elemental',
    'a demon',
    'a demon',
    'a demon',
    'a ghost',
    'a ghost',
    'a ghost',
    'one of the Fair Folk',
    'one of the Fair Folk',
    'one of the Fair Folk',
  ],

  blooded_type: [
    'a god-blooded mortal',
    'a god-blooded mortal',
    'a god-blooded mortal',
    'a ghost-blooded mortal',
    'a moon-touched mortal',
    'an elemental-blooded mortal',
  ],

  ability: [
    'Archery',
    'Athletics',
    'Awareness',
    'Brawl / Martial Arts',
    'Bureaucracy',
    'Craft',
    'Dodge',
    'Integrity',
    'Investigation',
    'Larceny',
    'Linguistics',
    'Lore',
    'Medicine',
    'Melee',
    'Occult',
    'Performance',
    'Presence',
    'Resistance',
    'Ride',
    'Sail',
    'Socialize',
    'Stealth',
    'Survival',
    'Thrown',
    'War',
  ],

  special_feature: [
    'its music',
    'its dance',
    'its beautiful artwork',
    'its architecture',
    'its famous buildings',
    'its literature',
    'its stories',
    'its sports',
    'its fascinating games',
    'its manufactured goods',
    'its natural resources',
    'its natural beauty',
    'its many lingering magical effects',
    'a powerful manse',
    '{Special: roll twice}',
  ],
};

// Check for special notes and table references.
// They're contained in {} curly braces.
function parseSpecial(text) {
  let matches = text.match(/{.+?}/);
  let roll_n = 1;
  let destination = false;
  if (matches === null) {
    //no-op
  } else {
    matches.forEach((item, i) => {
      let flag = item.replace(/[\{\}]/g, '');
      let flag_type = flag.split(': ')[0];
      let flag_setting = flag.split(': ')[1];
      if (flag_type === 'Special') {
        if (flag_setting === 'roll twice') {
          roll_n = 2;
        }
      } else if (flag_type === 'Table') {
        destination = flag_setting;
      }
    });
  }
  return { roll_n: roll_n, destination: destination };
}

let new_kingdom_button = document.getElementById('new_kingdom');
let previous_kingdoms = document.getElementById('previous_kingdoms');
new_kingdom.onclick = function () {
  let current_kingdom = document.getElementById('current_kingdom');
  let clone_kingdom = current_kingdom.cloneNode(true);
  clone_kingdom.id = '';
  clone_kingdom.className = 'old_kingdom';
  previous_kingdoms.prepend(clone_kingdom);
  setAllEntries();
};

function randInt(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

function randIcon(a, b) {
  let i = randInt(a, b);
  if (i < 10) {
    return '00' + String(i);
  }
  if (i < 100) {
    return '0' + String(i);
  }
  return String(i);
}

function callFromTable(table, depth = 0) {
  let info = data[table][randInt(0, data[table].length - 1)];
  let options = parseSpecial(info);
  info = info.replace(/\{.+?\}/g, '');
  let extra_text = '';
  let text = [];
  if (options.destination !== false) {
    extra_text = callFromTable(options.destination).text;
  }
  if (options.roll_n == 1) {
    text[0] = info + (extra_text ? extra_text : '');
  } else if (options.roll_n == 2) {
    if (depth === 0) {
      text[0] = 'both ' + callFromTable(table, depth + 1).text;
      text[1] = 'and ' + callFromTable(table, depth + 1).text;
    } else {
      return { text: '' };
    }
  }
  let main_text = text.join(', ');
  return { text: main_text };
}

function setGovtType() {
  let govt_span = document.getElementById('govt_type');
  let govt = callFromTable('govt_type');
  govt_span.textContent = govt.text;
}

function setLeaderType() {
  let leader_span = document.getElementById('leader_type');
  let leader = callFromTable('leader_type');
  leader_span.textContent = leader.text;
}

function setSpecialFeature() {
  let feature_span = document.getElementById('special_feature');
  let feature = callFromTable('special_feature');
  feature_span.textContent = feature.text;
}

function setIcon() {
  let icon = document.querySelector('#current_kingdom .kingdom_icon');
  let color_rot = randInt(0, 359);
  let right_bright = 50 + 10 * Math.sin((color_rot * 3.14159) / 180);
  icon.style.width = '2.5em';
  icon.setAttribute(
    'src',
    'icons/viscious-speed/abstract-' + randIcon(1, 121) + '.svg'
  );

  icon.style.filter =
    'invert(30%) sepia(100%) hue-rotate(' +
    color_rot +
    'deg) brightness(150%) saturate(200%)';
}

function setAllEntries() {
  setGovtType();
  setLeaderType();
  setSpecialFeature();
  setIcon();
}

setAllEntries();
