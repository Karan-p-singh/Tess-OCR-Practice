import React from "react";
import Tesseract from "tesseract.js";

import "./App.css";

const App = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [image, setImage] = React.useState("");
  const [text, setText] = React.useState("");
  const [progress, setProgress] = React.useState(0);
  const [match, setMatch] = React.useState([]);

  const handleSubmit = () => {
    setIsLoading(true);
    Tesseract.recognize(image, "eng", {
      logger: (m) => {
        // console.log(m);
        if (m.status === "recognizing text") {
          setProgress(parseInt(m.progress * 100));
        }
      },
    })
      .catch((err) => {
        console.error(err);
      })
      .then((result) => {
        // console.log(result.data);
        const lines = result.data.lines.map((line) => line.text);
        console.log(lines);
        //regex to find 11 digit number from lines array
        const regex = /\b\d{11}\b/gm;
        let m;
        while ((m = regex.exec(lines)) !== null) {
          // This is necessary to avoid infinite loops with zero-width matches
          if (m.index === regex.lastIndex) {
            regex.lastIndex++;
          }

          // The result can be accessed through the `m`-variable.
          m.forEach((match, groupIndex) => {
            console.log(`Found match, group ${groupIndex}: ${match}`);
            //save all matches to textArea
            setMatch((prev) => [...prev, match]);
          });
        }
        setText(result.data.text);
        setIsLoading(false);
      });
  };

  //       setText(result.data.text);
  //       setIsLoading(false);
  //     });
  // };

  return (
    <div className="container" style={{ height: "100vh" }}>
      <div className="row h-100">
        <div className="col-md-5 mx-auto h-100 d-flex flex-column justify-content-center">
          {!isLoading && (
            <h1 className="text-center py-5 mc-5">Image To Text</h1>
          )}
          {isLoading && (
            <>
              <progress className="form-control" value={progress} max="100">
                {progress}%{" "}
              </progress>{" "}
              <p className="text-center py-0 my-0">Converting:- {progress} %</p>
            </>
          )}
          {!isLoading && !text && (
            <>
              <input
                type="file"
                onChange={(e) =>
                  setImage(URL.createObjectURL(e.target.files[0]))
                }
                className="form-control mt-5 mb-2"
              />
              <input
                type="button"
                onClick={handleSubmit}
                className="btn btn-primary mt-5"
                value="Convert"
              />
            </>
          )}
          {!isLoading && text && (
            <>
              <textarea
                className="form-control w-100 mt-5"
                rows="30"
                value={text}
                onChange={(e) => setText(e.target.value)}
              ></textarea>
              <textarea
                className="form-control w-100 mt-5"
                rows="30"
                value={match}
                onChange={(e) => setMatch(e.target.value)}
              ></textarea>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
