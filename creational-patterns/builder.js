// Builder constructs complex objects by separating construction and representation

class Tag {
  static get indentSize() {
    return 2;
  }

  constructor(name = "", text = "") {
    this.name = name;
    this.text = text;
    this.children = [];
  }

  toStringImpl(indent) {
    let html = [];
    let i = " ".repeat(indent * Tag.indentSize);
    html.push(`${i}<${this.name}>\n`);
    if (this.text.length > 0) {
      html.push(" ".repeat(Tag.indentSize * (indent + 1)));
      html.push(this.text);
      html.push("\n");
    }

    for (let child of this.children) {
      html.push(child.toStringImpl(indent + 1));
    }

    html.push(`${i}</${this.name}>\n`);
    return html.join();
  }

  toString() {
    return this.toStringImpl(0);
  }

  static create(name) {
    return new HtmlBuilder(name);
  }
}

class HtmlBuilder {
  constructor(rootName) {
    this.root = new Tag(rootName);
    this.rootName = rootName;
  }

  addChild(childName, childText) {
    let child = new Tag(childName, childText);
    this.root.children.push(child);
  }

  // Fluent interface
  addChildFluent(childName, childText) {
    let child = new Tag(childName, childText);
    this.root.children.push(child);
    return this;
  }

  toString() {
    return this.root.toString();
  }

  clear() {
    this.root = new Tag(this.rootName);
  }

  build() {
    return this.root;
  }
}

// ! Same construction process doesn't create different representations of a html
const hello = "hello";
let html = [];
html.push("<p>");
html.push(hello);
html.push("</p>");
console.log(html.join(""));

const words = ["hello", "world"];
html = [];
html.push("<ul>\n");
for (let word of words) {
  html.push(`  <li>${word}</li>\n`);
}
html.push("</ul>");
console.log(html.join(""));

// let builder = new HtmlBuilder("ul");
// ! Introduces coupling
let builder = Tag.create("ul");
for (let word of words) {
  builder.addChild("li", word);
}
console.log(builder.root.toString());

builder.clear();
// builder
//   .addChildFluent("li", "foo")
//   .addChildFluent("li", "bar")
//   .addChildFluent("li", "baz");
// console.log(builder.toString());
