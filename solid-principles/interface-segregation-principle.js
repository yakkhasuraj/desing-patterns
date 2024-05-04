// Interface segregation principle: Clients should not be forced to depend upon interfaces that they do not use

var aggregation = (baseClass, ...mixins) => {
  class base extends baseClass {
    constructor(...args) {
      super(...args);
      mixins.forEach((mixin) => {
        copyProps(this, new mixin());
      });
    }
  }

  let copyProps = (target, source) => {
    // this function copies all properties and symbols, filtering out some special ones
    Object.getOwnPropertyNames(source)
      .concat(Object.getOwnPropertySymbols(source))
      .forEach((prop) => {
        if (
          !prop.match(
            /^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/
          )
        ) {
          Object.defineProperty(
            target,
            prop,
            Object.getOwnPropertyDescriptor(source, prop)
          );
        }
      });
  };

  mixins.forEach((mixin) => {
    // outside constructor() to allow aggregation(A,B,C).staticFunction() to be called etc.
    copyProps(base.prototype, mixin.prototype);
    copyProps(base, mixin);
  });
  return base;
};

class Document {}

class Machine {
  constructor() {
    if (this.constructor.name === "Machine") {
      throw new Error("Machine is abstract!");
    }
  }

  print(doc) {}
  fax(doc) {}
  scan(doc) {}
}

class MultiFunctionPrinter extends Machine {
  print(doc) {}

  fax(doc) {}

  scan(doc) {}
}

class NotImplementedError extends Error {
  constructor(name) {
    let msg = `${name} is not implemented!`;
    super(msg);

    // capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotImplementedError);
    }
  }
}

class OldFashionedPrinter extends Machine {
  print(doc) {
    // ok
  }

  // ! OldFashionedPrinter is forced to depend on methods it does not use
  // fax(doc) {
  //   // do nothing
  //   // principle of least surprise
  // }

  scan(doc) {
    // throw new Error("not implemented!");
    throw new NotImplementedError("OldFashionedPrinter.scan");
  }
}

let printer = new OldFashionedPrinter();
printer.scan();

// ISP = segregate (split up)
// * split interfaces that are very large into smaller and more specific ones so that clients will only have to know about the methods that are of interest to them
class Printer {
  constructor() {
    if (this.constructor.name === "Printer") {
      throw new Error("Printer is abstract!");
    }
  }

  print() {}
}

class Scanner {
  constructor() {
    if (this.constructor.name === "Scanner") {
      throw new Error("Scanner is abstract!");
    }
  }

  scan() {}
}

class Photocopier extends aggregation(Printer, Scanner) {
  print() {}

  scan() {}
}
