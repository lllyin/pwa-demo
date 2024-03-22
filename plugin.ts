import { IApi } from 'umi';
import * as fs from 'fs';
import * as path from 'path';

function readJSONFile(filePath: string, isParse = true): Promise<any> {
  return new Promise((resolve, reject) => {
    // 读取 JSON 文件
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject('读取文件时出错：' + err);
        return;
      }

      try {
        const jsonData = isParse ? JSON.parse(data) : data;
        resolve(jsonData);
      } catch (error) {
        reject('解析 JSON 时出错：' + error);
      }
    });
  });
}

function replaceAssetJson(text: string, newValue: string) {
  // 使用正则表达式替换ASSET_JSON的值
  return text.replace(
    /const\s+ASSET_JSON\s*=\s*{[^}]*}/g,
    `const ASSET_JSON = ${newValue}`
  );
}

function replacePlaceholder(filePath: string, replacement: string) {
  // 读取文件
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('读取文件时出错：', err);
      return;
    }

    // 替换占位变量
    const newData = replaceAssetJson(data, replacement);

    // 写回文件
    fs.writeFile(filePath, newData, 'utf8', (err) => {
      if (err) {
        console.error('写回文件时出错：', err);
        return;
      }
      console.log('文件中的占位变量已成功替换。');
    });
  });
}

export default (api: IApi) => {
  // api.onDevCompileDone((opts) => {
  //   const distPath = api.paths.absOutputPath;
  //   const assetFile = path.resolve(distPath, 'asset-manifest.json');
  //   const swFile = path.resolve(distPath, 'sw.js');

  //   readJSONFile(assetFile, false).then((jsonData) => {
  //     replacePlaceholder(swFile, jsonData);
  //   });

  //   console.log('> onDevCompileDone');
  // });

  api.onBuildComplete((opts) => {
    const distPath = api.paths.absOutputPath;
    const assetFile = path.resolve(distPath, 'asset-manifest.json');
    const swFile = path.resolve(distPath, 'sw.js');

    readJSONFile(assetFile, false).then((jsonData) => {
      replacePlaceholder(swFile, jsonData);
    });

    console.log('> onBuildComplete');
  });
};
