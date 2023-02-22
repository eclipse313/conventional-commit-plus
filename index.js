const emojis = {
   build: "🏗️",
   chore: "🔧",
   ci: "👷",
   docs: "📚",
   feat: "✨",
   fix: "🐛",
   perf: "🏎",
   refactor: "♻️",
   revert: "⏪️",
   style: "🎨",
   test: "🧪",
   wip: "🚧",
};

function getLastCharacter(subject) {
   if (subject == undefined) {
       return false;
   }

   return [...subject].pop();
}

module.exports = {
   extends: "@commitlint/config-conventional",
   plugins: [
       {
           rules: {
               "header-ends-with-emoji": (parsed) => {
                   // Get subject from parsed message
                   const { subject } = parsed;

                   // Get last character from subject
                   let lastCharacter = getLastCharacter(subject);

                   // Check if last character is an UTF-8 emoji
                   if (!subject || !/\p{Emoji}/u.test(lastCharacter)) {
                       return [false, "subject must end with a emoji"];
                   }

                   return [true, ""];
               },

               "header-ends-with-allowed-emoji": (parsed) => {
                   // Get subject from parsed message
                   const { subject } = parsed;

                   // Get last character from subject
                   let lastCharacter = getLastCharacter(subject);

                   // Check if last character matches one of the known emojis
                   if (!subject || !Object.values(emojis).includes(lastCharacter)) {
                       return [
                           false,
                           `subject must end with one emoji of ${Object.keys(emojis)
                               .map((emojiType) => `${emojis[emojiType]}`)
                               .join(", ")}`,
                       ];
                   }

                   return [true, ""];
               },

               "header-ends-with-matching-emoji": (parsed) => {
                   // Get type and subject from parsed message
                   const { type, subject } = parsed;

                   // Get last character from subject
                   let lastCharacter = getLastCharacter(subject);

                   // Check if last character matches the emoji of the type
                   if (!subject || emojis[type] != lastCharacter) {
                       // Check if type is defined
                       if (type == undefined || type == null) {
                           return [false, `type must not be empty to find matching emoji`];
                       }

                       // Check if type is one of the known types
                       if (emojis[type] == undefined) {
                           return [false, `type must not be ${type}: check configuration of type-enum rule`];
                       }

                       return [false, `subject must end with ${emojis[type]} for commit type ${type}`];
                   }

                   return [true, ""];
               },
           },
       },
   ],
   rules: {
       "header-ends-with-emoji": [2, "always"],
       "header-ends-with-allowed-emoji": [2, "always"],
       "header-ends-with-matching-emoji": [2, "always"],
       "type-enum": [
           2,
           "always",
           ["build", "chore", "ci", "docs", "feat", "fix", "perf", "refactor", "revert", "style", "test", "wip"],
       ],
   },
};
