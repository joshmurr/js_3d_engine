export class SimpleTest{
    log = {};
    id = 0;

    constructor(){

    }

    set test(s){
        this.currentTests = s;
    }

    get log(){
        return this.log;
    }

    createLogEntry(message, actual, expected, result){
        this.log[String(this.id++ + '_' + this.currentTests)] = {
            // "ID" : this.id++,
            "result" : result,
            "message" : message,
            "expected" : expected,
            "actual" : actual
        };
    }


    assert(message, actual, expected){
        if(actual === expected) {
            this.createLogEntry(message, actual, expected, "PASS");
        } else {
            this.createLogEntry(message, actual, expected, "FAIL");
        }
    }


}
