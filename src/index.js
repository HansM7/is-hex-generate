#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { program } from "commander";

function generateHexagonalModule(moduleName) {
  const basePath = path.join(process.cwd(), "src", moduleName);

  const structure = {
    application: {
      controllers: [`${moduleName}.controller.ts`],
      services: {
        commands: [
          `${moduleName}-create.service.ts`,
          `${moduleName}-delete.service.ts`,
          `${moduleName}-update.service.ts`,
        ],
        queries: [
          `${moduleName}-find-all.service.ts`,
          `${moduleName}-find-one.service.ts`,
        ],
        general: [
          `${moduleName}.service.ts`,
        ],
      },
    },
    domain: {
      dtos: [`${moduleName}-create.dto.ts`, `${moduleName}-update.dto.ts`],
      entities: [`${moduleName}.entity.ts`],
      interfaces: [
        `${moduleName}-create.interface.ts`,
        `${moduleName}-update.interface.ts`,
      ],
    },
    infrastructure: {
      adapters: [`${moduleName}.adapter.ts`],
      middlewares: [`${moduleName}.middleware.ts`],
      utils: [`${moduleName}.util.ts`],
    },
    test: [`${moduleName}.spec.ts`],
  };

  const rootFiles = [`${moduleName}.module.ts`, `${moduleName}.provider.ts`];

  const createStructure = (baseDir, struct) => {
    Object.keys(struct).forEach((key) => {
      const currentPath = path.join(baseDir, key);
      if (Array.isArray(struct[key])) {
        fs.mkdirSync(currentPath, { recursive: true });
        struct[key].forEach((file) => {
          const filePath = path.join(currentPath, file);
          if (!fs.existsSync(filePath)) {
            let content = `// ${file}`;
            if (file.endsWith(".service.ts")) {
              const className = file
                .replace(/(-\w)/g, (match) => match[1].toUpperCase())
                .replace(".service.ts", "Service");
              const classNameCapitalized = className.charAt(0).toUpperCase() + className.slice(1);
              content = `export class ${classNameCapitalized} {}`;
            }
            fs.writeFileSync(filePath, content, "utf8");
          }
        });
      } else if (typeof struct[key] === "object") {
        fs.mkdirSync(currentPath, { recursive: true });
        createStructure(currentPath, struct[key]);
      }
    });
  };

  const createRootFiles = (baseDir, files) => {
    files.forEach((file) => {
      const filePath = path.join(baseDir, file);
      if (!fs.existsSync(filePath)) {
        const className = file
          .replace(/(-\w)/g, (match) => match[1].toUpperCase())
          .replace(".ts", "")
          .replace(/\./g, "")
          .replace(
            moduleName,
            moduleName[0].toUpperCase() + moduleName.slice(1)
          );
        const content = file.endsWith(".module.ts")
          ? `// Here is export & import control`
          : file.endsWith(".provider.ts")
          ? `// Here is export all providers`
          : `// ${file}`;
        fs.writeFileSync(filePath, content, "utf8");
      }
    });
  };

  fs.mkdirSync(basePath, { recursive: true });

  createStructure(basePath, structure);
  createRootFiles(basePath, rootFiles);

  console.log(`Módulo ${moduleName} generado exitosamente en ${basePath}`);
}

program
  .argument("<module-name>", "Nombre del módulo a generar")
  .action((moduleName) => {
    generateHexagonalModule(moduleName);
  });

program.parse(process.argv);
