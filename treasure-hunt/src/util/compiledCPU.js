/* CPU functionality. */
import * as sys from "sys";
export class compiledCPU {
  /* Main CPU class. */
  constructor() {
    /* Construct a new CPU. */
    this.ram = Array(256).fill(0);
    this.reg = Array(8).fill(0);
    this.SP = 7;
    this.reg[this.SP] = 244;
    this.pc = 0;
    /*
        FL bits: 00000LGE
        L Less-than: during a CMP, set to 1 if registerA is less than registerB, zero otherwise.
        G Greater-than: during a CMP, set to 1 if registerA is greater than registerB, zero otherwise.
        E Equal: during a CMP, set to 1 if registerA is equal to registerB, zero otherwise.
        */
    this.fl = 0;
    var LDI;
    LDI = (operand_a, operand_b) => {
      this.reg[operand_a] = operand_b;
      this.pc += 3;
    };
    var PRN;
    PRN = (operand_a, operand_b) => {
      console.log(`${this.reg[operand_a]}`);
      this.pc += 2;
    };
    var PUSH;
    PUSH = (operand_a, operand_b) => {
      var reg_num, reg_val;
      this.reg[this.SP] -= 1;
      reg_num = operand_a;
      reg_val = this.reg[reg_num];
      this.ram[this.reg[this.SP]] = reg_val;
      this.pc += 2;
    };
    var POP;
    POP = (operand_a, operand_b) => {
      var reg_num, val;
      val = this.ram[this.reg[this.SP]];
      reg_num = operand_a;
      this.reg[reg_num] = val;
      this.reg[this.SP] += 1;
      this.pc += 2;
    };
    var CALL;
    CALL = (operand_a, operand_b) => {
      var reg_num, return_address;
      return_address = this.pc + 2;
      this.reg[this.SP] -= 1;
      this.ram[this.reg[this.SP]] = return_address;
      reg_num = operand_a;
      this.pc = this.reg[reg_num];
    };
    var RET;
    RET = (operand_a, operand_b) => {
      this.pc = this.ram[this.reg[this.SP]];
      this.reg[this.SP] += 1;
    };
    var JMP;
    JMP = (operand_a, operand_b) => {
      this.pc = this.reg[operand_a];
    };
    var JEQ;
    JEQ = (operand_a, operand_b) => {
      let binary = parseInt(this.fl, 10).toString(2);
      if (binary.slice(-1)[0] === "1") {
        new JMP(operand_a, operand_b);
      } else {
        this.pc += 2;
      }
    };
    var JNE;
    JNE = (operand_a, operand_b) => {
      let binary = parseInt(this.fl, 10).toString(2);
      if (binary.slice(-1)[0] === "0") {
        new JMP(operand_a, operand_b);
      } else {
        this.pc += 2;
      }
    };
    var MUL;
    MUL = (operand_a, operand_b) => {
      this.alu("MUL", operand_a, operand_b);
      this.pc += 3;
    };
    var ADD;
    ADD = (operand_a, operand_b) => {
      this.alu("ADD", operand_a, operand_b);
      this.pc += 3;
    };
    var SUB;
    SUB = (operand_a, operand_b) => {
      this.alu("SUB", operand_a, operand_b);
      this.pc += 3;
    };
    var CMP;
    CMP = (operand_a, operand_b) => {
      this.alu("CMP", operand_a, operand_b);
      this.pc += 3;
    };
    var AND;
    AND = (operand_a, operand_b) => {
      this.alu("AND", operand_a, operand_b);
      this.pc += 3;
    };
    var OR;
    OR = (operand_a, operand_b) => {
      this.alu("OR", operand_a, operand_b);
      this.pc += 3;
    };
    var XOR;
    XOR = (operand_a, operand_b) => {
      this.alu("XOR", operand_a, operand_b);
      this.pc += 3;
    };
    var NOT;
    NOT = (operand_a, operand_b) => {
      this.alu("NOT", operand_a, operand_b);
      this.pc += 2;
    };
    var SHL;
    SHL = (operand_a, operand_b) => {
      this.alu("SHL", operand_a, operand_b);
      this.pc += 3;
    };
    var SHR;
    SHR = (operand_a, operand_b) => {
      this.alu("SHR", operand_a, operand_b);
      this.pc += 3;
    };
    var MOD;
    MOD = (operand_a, operand_b) => {
      this.alu("MOD", operand_a, operand_b);
      this.pc += 3;
    };
    var HLT;
    HLT = (operand_a, operand_b) => {
      this.running = false;
      this.pc += 1;
    };
    var PRA;
    PRA = (operand_a, operand_b) => {
      this.message += `${String.fromCharCode(this.reg[operand_a])}`;
      this.pc += 2;
    };
    var INC;
    INC = (operand_a, operand_b) => {
      this.alu("INC", operand_a, operand_b);
      this.pc += 2;
    };
    var DEC;
    DEC = (operand_a, operand_b) => {
      this.alu("DEC", operand_a, operand_b);
      this.pc += 2;
    };
    this.running = true;
    this.opcodes = {
      [130]: LDI,
      [71]: PRN,
      [1]: HLT,
      [162]: MUL,
      [160]: ADD,
      [161]: SUB,
      [69]: PUSH,
      [70]: POP,
      [80]: CALL,
      [17]: RET,
      [167]: CMP,
      [84]: JMP,
      [85]: JEQ,
      [86]: JNE,
      [168]: AND,
      [170]: OR,
      [171]: XOR,
      [105]: NOT,
      [172]: SHL,
      [173]: SHR,
      [164]: MOD,
      [72]: PRA,
      [102]: DEC,
      [101]: INC
    };
  }

  load(program) {
    // console.log("program", program);
    let address = 0;
    let split = program.split("\n");
    let code = split.slice(2, split.length);
    // console.log("code", code);
    for (let line of code) {
      this.ram_write(address, parseInt(line, 2));
      //   console.log("line", line, parseInt(line, 2));
      address += 1;
    }
  }
  alu(op, reg_a, reg_b) {
    /* ALU operations. */
    var alu_op, alu_opcodes;
    var ADD;
    var MUL;
    var SUB;
    var CMP;
    var AND;
    var OR;
    var XOR;
    var NOT;
    var SHL;
    var SHR;
    var MOD;
    var INC;
    var DEC;
    ADD = (reg_a, reg_b) => {
      this.reg[reg_a] += this.reg[reg_b];
    };
    MUL = (reg_a, reg_b) => {
      this.reg[reg_a] *= this.reg[reg_b];
    };
    SUB = (reg_a, reg_b) => {
      this.reg[reg_a] -= this.reg[reg_b];
    };
    CMP = (reg_a, reg_b) => {
      var a, b, compared_value;
      a = this.reg[reg_a];
      b = this.reg[reg_b];
      compared_value = a - b;
      if (compared_value > 0) {
        this.fl = 2;
      } else {
        if (compared_value < 0) {
          this.fl = 4;
        } else {
          if (compared_value === 0) {
            this.fl = 1;
          } else {
            this.fl = 0;
          }
        }
      }
    };
    AND = (reg_a, reg_b) => {
      var a, and_result, b;
      a = this.reg[reg_a];
      b = this.reg[reg_b];
      and_result = a & b;
      this.reg[reg_a] = and_result;
    };
    OR = (reg_a, reg_b) => {
      var a, b, or_result;
      a = this.reg[reg_a];
      b = this.reg[reg_b];
      or_result = a | b;
      this.reg[reg_a] = or_result;
    };
    XOR = (reg_a, reg_b) => {
      var a, b, xor_result;
      a = this.reg[reg_a];
      b = this.reg[reg_b];
      xor_result = a ^ b;
      this.reg[reg_a] = xor_result;
    };
    NOT = (reg_a, reg_b) => {
      var a, not_result;
      a = this.reg[reg_a];
      not_result = ~a;
      this.reg[reg_a] = not_result;
    };
    SHL = (reg_a, reg_b) => {
      var a, b, shl_result;
      a = this.reg[reg_a];
      b = this.reg[reg_b];
      shl_result = a << b;
      this.reg[reg_a] = shl_result;
    };
    SHR = (reg_a, reg_b) => {
      var a, b, shr_result;
      a = this.reg[reg_a];
      b = this.reg[reg_b];
      shr_result = a >> b;
      this.reg[reg_a] = shr_result;
    };
    MOD = (reg_a, reg_b) => {
      var a, b, mod_result;
      a = this.reg[reg_a];
      b = this.reg[reg_b];
      if (b === 0) {
        this.running = false;
        throw new Error("Cannot divide by 0.");
      }
      mod_result = a % b;
      this.reg[reg_a] = mod_result;
    };
    INC = (reg_a, reg_b) => {
      this.reg[reg_a] += 1;
    };
    DEC = (reg_a, reg_b) => {
      this.reg[reg_a] -= 1;
    };
    alu_opcodes = {
      ADD: ADD,
      SUB: SUB,
      MUL: MUL,
      CMP: CMP,
      AND: AND,
      OR: OR,
      XOR: XOR,
      NOT: NOT,
      SHL: SHL,
      SHR: SHR,
      MOD: MOD,
      INC: INC,
      DEC: DEC
    };
    alu_op = alu_opcodes[op];
    if (alu_op) {
      alu_op(reg_a, reg_b);
    } else {
      throw new Error("Unsupported ALU operation");
    }
  }
  trace() {
    /*
        Handy function to print out the CPU state. You might want to call this
        from run() if you need help debugging.
        */
    console.log(
      `TRACE: %02X | %02X %02X %02X |` %
        [
          this.pc,
          this.ram_read(this.pc),
          this.ram_read(this.pc + 1),
          this.ram_read(this.pc + 2)
        ]
    );
    for (var i = 0, _pj_a = 8; i < _pj_a; i += 1) {
      console.log(" %02X" % this.reg[i]);
    }
    console.log();
  }
  ram_read(mar) {
    return this.ram[mar];
  }
  ram_write(mar, mdr) {
    this.ram[mar] = mdr;
    return true;
  }
  run() {
    /* Run the CPU. */
    this.message = "";
    var ir, opcode, operand_a, operand_b;
    while (this.running) {
      ir = this.ram_read(this.pc);
      operand_a = this.ram_read(this.pc + 1);
      operand_b = this.ram_read(this.pc + 2);
      opcode = this.opcodes[ir];
      if (opcode) {
        opcode(operand_a, operand_b);
      } else {
        console.log(`Unknown command: ${ir}`);
        sys.exit(1);
      }
    }
    return this.message.slice(this.message.length - 3, this.message.length);
  }
}

//# sourceMappingURL=kevinCPU.js.map
