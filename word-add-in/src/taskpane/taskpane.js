/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global document, Office, Word */

import { base64Image } from "../../base64Image";

Office.onReady((info) => {
  if (info.host === Office.HostType.Word) {
    document.getElementById("sideload-msg").style.display = "none";
    document.getElementById("app-body").style.display = "flex";
    // Assign event handlers and other initialization logic.
    document.getElementById("insert-paragraph").onclick = () => tryCatch(insertParagraph);
    document.getElementById("apply-style").onclick = () => tryCatch(applyStyle);
    document.getElementById("apply-custom-style").onclick = () => tryCatch(applyCustomStyle);
    document.getElementById("change-font").onclick = () => tryCatch(changeFont);
    document.getElementById("insert-image").onclick = () => tryCatch(insertImage);
    document.getElementById("insert-text-into-range").onclick = () => tryCatch(insertTextIntoRange);
    document.getElementById("insert-text-outside-range").onclick = () => tryCatch(insertTextBeforeRange);
    document.getElementById("replace-text").onclick = () => tryCatch(replaceText);
    document.getElementById("logo").onclick = () => tryCatch(showLogo);
  }
});
async function insertParagraph() {
  await Word.run(async (context) => {

    const docBody = context.document.body;
    docBody.insertParagraph("There are many versions of Office, including Office 2016, Microsoft 365 subscription, Office on the web, and more.",
      Word.InsertLocation.start);
    await context.sync();
  });
}

/** Default helper for invoking an action and handling errors. */
async function tryCatch(callback) {
  try {
    await callback();
  } catch (error) {
    // Note: In a production add-in, you'd want to notify the user through your add-in's UI.
    console.error(error);
  }
}

async function applyStyle() {
  await Word.run(async (context) => {

    const firstParagraph = context.document.body.paragraphs.getFirst();
    firstParagraph.styleBuiltIn = Word.Style.intenseReference;

    await context.sync();
  });
}

async function applyCustomStyle() {
  await Word.run(async (context) => {

    const lastParagraph = context.document.body.paragraphs.getLast();
    lastParagraph.style = "MyCustomStyle";

    await context.sync();
  });
}

async function changeFont() {
  await Word.run(async (context) => {

    const secondParagraph = context.document.body.paragraphs.getFirst().getNext();
    secondParagraph.font.set({
      name: "TypeLand.com 康熙字典體",
      bold: true,
      size: 18
    });

    await context.sync();
  });
}

async function insertImage() {
  await Word.run(async (context) => {

    context.document.body.insertInlinePictureFromBase64(base64Image, Word.InsertLocation.end);

      await context.sync();
  });
}

async function insertTextIntoRange() {
  await Word.run(async (context) => {

    const doc = context.document;
    const originalRange = doc.getSelection();
    originalRange.insertText(" (M365)", Word.InsertLocation.end);
    
    originalRange.load("text");
    await context.sync();

    doc.body.insertParagraph("Original range: " + originalRange.text, Word.InsertLocation.end);

    await context.sync();
  });
}

async function insertTextBeforeRange() {
  await Word.run(async (context) => {

    const doc = context.document;
    const originalRange = doc.getSelection();
    originalRange.insertText("Office 2019, ", Word.InsertLocation.before);

    originalRange.load("text");
    await context.sync();
    
    doc.body.insertParagraph("Current text of original range: " + originalRange.text, Word.InsertLocation.end);
    
    await context.sync();
  });
}

async function replaceText() {
  await Word.run(async (context) => {

    const doc = context.document;
    const originalRange = doc.getSelection();
    originalRange.insertText("many", Word.InsertLocation.replace);

      await context.sync();
  });
}

async function showLogo() {
  await Word.run(async (context) => {
    context.document.body.insertInlinePictureFromBase64(base64Image, Word.InsertLocation.end);
    await context.sync();
  });
}