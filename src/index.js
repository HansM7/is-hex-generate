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
          `${moduleName}-config.service.ts`,
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
    rootFiles: [`${moduleName}.module.ts`, `${moduleName}.provider.ts`],
  };

  const createStructure = (baseDir, struct) => {
    Object.keys(struct).forEach((key) => {
      const currentPath = path.join(baseDir, key);
      if (Array.isArray(struct[key])) {
        fs.mkdirSync(currentPath, { recursive: true });
        struct[key].forEach((file) => {
          const filePath = path.join(currentPath, file);
          fs.writeFileSync(filePath, `// ${file}`, "utf8");
        });
      } else if (typeof struct[key] === "object") {
        fs.mkdirSync(currentPath, { recursive: true });
        createStructure(currentPath, struct[key]);
      }
    });
  };

  fs.mkdirSync(basePath, { recursive: true });

  createStructure(basePath, structure);

  structure.rootFiles.forEach((file) => {
    const filePath = path.join(basePath, file);
    fs.writeFileSync(filePath, `// ${file}`, "utf8");
  });

  console.log(`Módulo ${moduleName} generado exitosamente en ${basePath}`);
}

program
  .argument("<module-name>", "Nombre del módulo a generar")
  .action((moduleName) => {
    generateHexagonalModule(moduleName);
  });

program.parse(process.argv);
