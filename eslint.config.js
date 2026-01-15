import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import { fixupConfigRules } from "@eslint/js";

// Importa le configurazioni di Prettier
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";


export default [
  // 1. Configurazione JavaScript di base
  pluginJs.configs.recommended,

  // 2. Configurazione React di base (per le regole specifiche di React)
  ...fixupConfigRules(pluginReactConfig),

  // 3. Configurazione per Prettier
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      // Usa le regole di Prettier per la formattazione
      "prettier/prettier": "error",
      
      // Regola di esempio: disabilita prop-types se non li usi
      "react/prop-types": "off", 
      
      // Regola di esempio: importante per React 17+
      "react/react-in-jsx-scope": "off", 
    },
    
  },
  
  // 4. Configurazione per disabilitare i conflitti di stile con Prettier
  prettierConfig,
  
  // Impostazioni globali e per il linguaggio (copiate o modificate dalla tua configurazione iniziale di Vite)
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        sourceType: "module",
      },
    },
  },

  // Ignora file e directory
  {
      ignores: ["dist", "node_modules"],
  }
];