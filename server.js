const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const PORT = process.env.PORT || 3000;
const {
  AddContact,
  DeleteUser,
  UpdateUserInfo,
  GetContact,
} = require("./api/actions");
const { formValidationSchema } = require("./schema/formvalidation");

app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("views", "./views");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");
app.set("view engine", "ejs");

app.get("/", async function (req, res) {
  res.render("index", {
    title: "Welcome to my Website!",
  });
});

app.get("/about", async function (req, res) {
  // console.log("Rendering about page...");
  res.render("about", {
    title: "About Us",
    teamMembers: [
      { name: "Kajal Thakyal", position: "CEO", image: "kajal.png" },
    ],
  });
});

app.get("/contact", async function (req, res) {
  res.render("contact", {
    title: "Contact Us",
  });
});

app.post("/submit-contact", (req, res) => {
  // const { name, email, message } = req.body;
  const body = req.body;
  const validatedData = formValidationSchema.safeParse(body);

  if (!validatedData.success) {
    res.render("error", {
      title: "Error Page",
      heading: "Form Validation Failed",
      errorMessage: validatedData.error.errors,
      suggestion: "Go Back And Try Submitting The Form Again",
    });
  }
  const { name, email, message } = validatedData.data;
  AddContact(name, email, message, (err, row) => {
    if (err) {
      res.render("error", {
        title: "Error Page",
        heading: "Error Creating Database Entry",
        errorMessage: err.message,
        suggestion: "Try To Submit  the form Again",
      });
      return;
    }

    res.render("submit", {
      title: "Welcome to my portfolio!",
      mode: "submitted",
      formData: row,
    });
  });
});

app.post("/deleteUser", (req, res) => {
  const { id } = req.body;
  if (!id) {
    res.render("error", {
      title: "Error Page",
      heading: "ID Is Required",
      errorMessage: "This process failed because the id is not provided",
      suggestion: "",
    });
    return;
  }

  GetContact(id, (err, row) => {
    if (err) {
      res.render("error", {
        title: "Error Page",
        heading: "Could not  delete the entry",
        errorMessage: err.message,
        suggestion: "",
      });
      return;
    }

    DeleteUser(id, (err, changes) => {
      if (err) {
        res.render("error", {
          title: "Error Page",
          heading: "Could not  delete the entry",
          errorMessage: err.message,
          suggestion: "Try to Go back",
        });
        return;
      }

      res.render("deletesuccess", {
        title: "Delete was Successful",
      });
    });
  });
});

app.post("/updatemessage", (req, res) => {
  const { id, ...body } = req.body;

  const validatedData = formValidationSchema.safeParse(body);

  if (!validatedData.success) {
    res.render("error", {
      title: "Error Page",
      heading: "Invalid Data is Provided",
      errorMessage: validatedData.error.errors,
      suggestion: "Make Request from This Website",
    });
    return;
  }

  GetContact(id, (err, row) => {
    if (err) {
      res.render("error", {
        title: "Error Page",
        heading: "Could not Update the entry",
        errorMessage: err.message,
        suggestion: "Try to Go back",
      });
      return;
    }
    const { message, name, email } = validatedData.data;

    res.render("updateform", {
      title: "Update Form Page",
      id,
      name,
      email,
      message,
    });
  });
});

app.post("/updateuserinfo", (req, res) => {
  const { id, ...body } = req.body;

  const validatedData = formValidationSchema.safeParse(body);
  if (!validatedData.success) {
    res.render("error", {
      title: "Error Page",
      heading: "Proper Data is Missing",
      errorMessage: validatedData.error.errors,
      suggestion: "Make Request from This Website",
    });

    return;
  }

  const { email, message, name } = validatedData.data;

  UpdateUserInfo(id, name, email, message, (err, row) => {
    if (err) {
      res.render("error", {
        title: "Error Page",
        heading: "Error Updating Your Message",
        errorMessage: err.message,
        suggestion: "Make Request from This Website",
      });

      return;
    }
    res.render("submit", {
      title: "Welcome to my portfolio!",
      mode: "Updated",
      formData: row,
    });
  });
});

app.get("/deals", async function (req, res) {
  res.render("deals", {
    title: "Deals",
  });
});

let user = {
  name: "Kajal Thakyal",
  email: "Kajal@gmail.com",
  bio: "Digital Marketer.",
  username: "Kajal123",
  password: "********",
};

app.get("/products", (req, res) => {
  res.render("products", { title: "Products", user });
});

app.use((req, res, next) => {
  res.render("wrongroute", { title: "wrong route" });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
