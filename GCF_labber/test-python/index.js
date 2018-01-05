const PythonShell = require("python-shell");

exports.hello = function (req,res){
    sayHello()
        .then(r=>{
            res.json({result:r});
        })
        .catch(err=>{
            res.status(500).json({message:"Server internal fault"});
        })
}

function sayHello() {
    return new Promise(function(resolve, reject) {
        var pyshell = new PythonShell("hello.py", {
            mode: "text"
        });

        // Send data.
        // pyshell.send(a_ele);

        // If we get data from .py stdin , then we print it.
        pyshell.on('message', function(message) {
            resolve(message);
        });

        // If we get error from .py stderr , then we print it.
        pyshell.on('error', function(err) {
            reject(err["traceback"]);
        })
    });
};
