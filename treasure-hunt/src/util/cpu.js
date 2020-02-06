// class CPU:
// """Main CPU class."""
// ​
// def __init__(self):
//     """Construct a new CPU."""
//     # Create memory (256 bits)
//     self.ram = [0] * 256
// ​
//     # 8 general-purpose 8-bit numeric registers R0-R7
//     # R5 is reserved as the interrupt mask (IM)
//     # R6 is reserved as the interrupt status (IS)
//     # R7 is reserved as the stack pointer (SP)
//     self.reg = [0] * 8
// ​
//     self.SP = 7
// ​
//     self.reg[self.SP] = 0xf4
// ​
//     # Program Counter (PC)
//     # Keep track of where you are on the memory stack
//     self.pc = 0
// ​
//     # Flag register (FL)
//     # Holds the current flags status
//     # These flags can change based on the operands given to the CMP opcode
//     '''
//     FL bits: 00000LGE
//     L Less-than: during a CMP, set to 1 if registerA is less than registerB, zero otherwise.
//     G Greater-than: during a CMP, set to 1 if registerA is greater than registerB, zero otherwise.
//     E Equal: during a CMP, set to 1 if registerA is equal to registerB, zero otherwise.
//     '''
//     self.fl = 0b00000000
// ​
//     # Used for generic functions for the CPU
//     def LDI(operand_a, operand_b):
//         self.reg[operand_a] = operand_b
//         self.pc += 3
// ​
//     def PRN(operand_a, operand_b):
//         print(f'{self.reg[operand_a]}')
//         self.pc += 2
// ​
//     def PUSH(operand_a, operand_b):
//         self.reg[self.SP] -= 1
//         reg_num = operand_a
//         reg_val = self.reg[reg_num]
//         # Copy reg value into memory at address SP
//         self.ram[self.reg[self.SP]] = reg_val
//         self.pc += 2
// ​
//     def POP(operand_a, operand_b):
//         val = self.ram[self.reg[self.SP]]
//         reg_num = operand_a
//         # Copy value from memory at SP into register
//         self.reg[reg_num] = val
//         self.reg[self.SP] += 1
//         self.pc += 2
// ​
//     def CALL(operand_a, operand_b):
//         # Push return address on the stack
//         return_address = self.pc + 2
//         self.reg[self.SP] -= 1  # decrement SP
//         self.ram[self.reg[self.SP]] = return_address
// ​
//         # Set the PC to the value in the register
//         reg_num = operand_a
//         self.pc = self.reg[reg_num]
// ​
//     def RET(operand_a, operand_b):
//         # Pop the return address off the stack
//         # Store it in the PC
//         self.pc = self.ram[self.reg[self.SP]]
//         self.reg[self.SP] += 1
// ​
//     def JMP(operand_a, operand_b):
//         self.pc = self.reg[operand_a]
// ​
//     def JEQ(operand_a, operand_b):
//         if bin(self.fl)[-1] == '1':
//             JMP(operand_a, operand_b)
//         else:
//             self.pc += 2
// ​
//     def JNE(operand_a, operand_b):
//         if bin(self.fl)[-1] == '0':
//             JMP(operand_a, operand_b)
//         else:
//             self.pc += 2
// ​
//     # Calls on ALU
//     def MUL(operand_a, operand_b):
//         self.alu('MUL', operand_a, operand_b)
//         self.pc += 3
// ​
//     def ADD(operand_a, operand_b):
//         self.alu('ADD', operand_a, operand_b)
//         self.pc += 3
// ​
//     def SUB(operand_a, operand_b):
//         self.alu('SUB', operand_a, operand_b)
//         self.pc += 3
// ​
//     def CMP(operand_a, operand_b):
//         self.alu('CMP', operand_a, operand_b)
//         self.pc += 3
// ​
//     def AND(operand_a, operand_b):
//         self.alu('AND', operand_a, operand_b)
//         self.pc += 3
// ​
//     def OR(operand_a, operand_b):
//         self.alu('OR', operand_a, operand_b)
//         self.pc += 3
// ​
//     def XOR(operand_a, operand_b):
//         self.alu('XOR', operand_a, operand_b)
//         self.pc += 3
// ​
//     def NOT(operand_a, operand_b):
//         self.alu('NOT', operand_a, operand_b)
//         self.pc += 2
// ​
//     def SHL(operand_a, operand_b):
//         self.alu('SHL', operand_a, operand_b)
//         self.pc += 3
// ​
//     def SHR(operand_a, operand_b):
//         self.alu('SHR', operand_a, operand_b)
//         self.pc += 3
// ​
//     def MOD(operand_a, operand_b):
//         self.alu('MOD', operand_a, operand_b)
//         self.pc += 3
// ​
//     # Used to stop running CPU
//     def HLT(operand_a, operand_b):
//         self.running = False
//         self.pc += 1
// ​
//     # For CS BW 2
//     def PRA(operand_a, operand_b):
//         print(f'{chr(self.reg[operand_a])}')
//         self.pc += 2
// ​
//     def INC(operand_a, operand_b):
//         self.alu('INC', operand_a, operand_b)
//         self.pc += 2
// ​
//     def DEC(operand_a, operand_b):
//         self.alu('DEC', operand_a, operand_b)
//         self.pc += 2
// ​
//     self.running = True
// ​
//     self.opcodes = {
//         # List of opcodes
//         0b10000010: LDI,
//         0b01000111: PRN,
//         0b00000001: HLT,
//         0b10100010: MUL,
//         0b10100000: ADD,
//         0b10100001: SUB,
//         0b01000101: PUSH,
//         0b01000110: POP,
//         0b01010000: CALL,
//         0b00010001: RET,
//         0b10100111: CMP,
//         0b01010100: JMP,
//         0b01010101: JEQ,
//         0b01010110: JNE,
//         0b10101000: AND,
//         0b10101010: OR,
//         0b10101011: XOR,
//         0b01101001: NOT,
//         0b10101100: SHL,
//         0b10101101: SHR,
//         0b10100100: MOD,
// ​
//         # For CS BW 2
//         0b01001000: PRA,
//         0b01100110: DEC,
//         0b01100101: INC
//     }
// ​
// def load(self):
//     """Load a program into memory."""
// ​
//     address = 0
// ​
//     program = []
// ​
//     f = open(f'{sys.argv[1]}', 'r')
// ​
//     for i in f.read().split('\n'):
//         if i != '' and i[0] != '#':
//             x = int(i[:8], 2)
//             program.append(x)
// ​
//     f.close()
// ​
//     for instruction in program:
//         self.ram[address] = instruction
//         address += 1
// ​
// def alu(self, op, reg_a, reg_b):
//     """ALU operations."""
// ​
//     def ADD(reg_a, reg_b):
//         self.reg[reg_a] += self.reg[reg_b]
// ​
//     def MUL(reg_a, reg_b):
//         self.reg[reg_a] *= self.reg[reg_b]
// ​
//     def SUB(reg_a, reg_b):
//         self.reg[reg_a] -= self.reg[reg_b]
// ​
//     def CMP(reg_a, reg_b):
//         a = self.reg[reg_a]
//         b = self.reg[reg_b]
// ​
//         compared_value = a - b
// ​
//         if compared_value > 0:
//             self.fl = 0b00000010
//         elif compared_value < 0:
//             self.fl = 0b00000100
//         elif compared_value == 0:
//             self.fl = 0b00000001
//         else:
//             self.fl = 0b00000000
// ​
//     def AND(reg_a, reg_b):
//         a = self.reg[reg_a]
//         b = self.reg[reg_b]
// ​
//         and_result = a & b
// ​
//         self.reg[reg_a] = and_result
// ​
//     def OR(reg_a, reg_b):
//         a = self.reg[reg_a]
//         b = self.reg[reg_b]
// ​
//         or_result = a | b
// ​
//         self.reg[reg_a] = or_result
// ​
//     def XOR(reg_a, reg_b):
//         a = self.reg[reg_a]
//         b = self.reg[reg_b]
// ​
//         xor_result = a ^ b
// ​
//         self.reg[reg_a] = xor_result
// ​
//     def NOT(reg_a, reg_b):
//         a = self.reg[reg_a]
// ​
//         not_result = ~a
// ​
//         self.reg[reg_a] = not_result
// ​
//     def SHL(reg_a, reg_b):
//         a = self.reg[reg_a]
//         b = self.reg[reg_b]
// ​
//         shl_result = a << b
// ​
//         self.reg[reg_a] = shl_result
// ​
//     def SHR(reg_a, reg_b):
//         a = self.reg[reg_a]
//         b = self.reg[reg_b]
// ​
//         shr_result = a >> b
// ​
//         self.reg[reg_a] = shr_result
// ​
//     def MOD(reg_a, reg_b):
//         a = self.reg[reg_a]
//         b = self.reg[reg_b]
// ​
//         if b == 0:
//             self.running = False  # Halts the program
//             raise Exception("Cannot divide by 0.")
// ​
//         mod_result = a % b
// ​
//         self.reg[reg_a] = mod_result
// ​
//     # For CS BW 2
//     def INC(reg_a, reg_b):
//         self.reg[reg_a] += 1
// ​
//     def DEC(reg_a, reg_b):
//         self.reg[reg_a] -= 1
// ​
//     alu_opcodes = {
//         'ADD': ADD,
//         'SUB': SUB,
//         'MUL': MUL,
//         'CMP': CMP,
//         'AND': AND,
//         'OR': OR,
//         'XOR': XOR,
//         'NOT': NOT,
//         'SHL': SHL,
//         'SHR': SHR,
//         'MOD': MOD,
//         'INC': INC,
//         'DEC': DEC
//     }
// ​
//     alu_op = alu_opcodes[op]
// ​
//     if alu_op:
//         alu_op(reg_a, reg_b)
//     else:
//         raise Exception("Unsupported ALU operation")
// ​
// def trace(self):
//     """
//     Handy function to print out the CPU state. You might want to call this
//     from run() if you need help debugging.
//     """
// ​
//     print(f"TRACE: %02X | %02X %02X %02X |" % (
//         self.pc,
//         # self.fl,
//         # self.ie,
//         self.ram_read(self.pc),
//         self.ram_read(self.pc + 1),
//         self.ram_read(self.pc + 2)
//     ), end='')
// ​
//     for i in range(8):
//         print(" %02X" % self.reg[i], end='')
// ​
//     print()
// ​
// '''
// Inside the CPU, there are two internal registers used for memory operations:
// the Memory Address Register (MAR) and the Memory Data Register (MDR).
// The MAR contains the address that is being read or written to.
// The MDR contains the data that was read or the data to write.
// '''
// ​
// # Accepts the address to read and return the value stored there.
// def ram_read(self, mar):
//     return self.ram[mar]
// ​
// # Accepts a value to write, and the address to write it to.
// def ram_write(self, mar, mdr):
//     self.ram[mar] = mdr
//     return True
// ​
// def run(self):
//     """Run the CPU."""
//     # Start running the CPU
//     while self.running:
//         # self.trace()  # Used to debug
//         # Get the first set of instructions
//         # Instruction Register (IR)
//         ir = self.ram_read(self.pc)
//         operand_a = self.ram_read(self.pc + 1)
//         operand_b = self.ram_read(self.pc + 2)
// ​
//         opcode = self.opcodes[ir]
// ​
//         if opcode:
//             opcode(operand_a, operand_b)
//         else:
//             print(f'Unknown command: {ir}')
//             sys.exit(1)

export class CPU {
  constructor() {
    this.SP = 7;
    this.ram = Array(256).fill(0);
    this.reg = Array(8).fill(0);
    this.pc = 0;
    this.fl = 0b00000000;
    this.reg[this.SP] = 0xf4;
    this.running = true;

    this.message = "";

    this.opcodes = {
      // List of opcodes
      0b10000010: LDI,
      0b01000111: PRN,
      0b01000101: PUSH,
      0b01000110: POP,
      0b01010000: CALL,
      0b00010001: RET,
      0b01010100: JMP,
      0b01010101: JEQ,
      0b01010110: JNE,
      0b00000001: HLT,

      0b10100010: MUL,
      0b10100000: ADD,
      0b10100001: SUB,
      0b10100111: CMP,
      0b10101000: AND,
      0b10101010: OR,
      0b10101011: XOR,
      0b01101001: NOT,
      0b10101100: SHL,
      0b10101101: SHR,
      0b10100100: MOD,
      // For CS BW 2
      0b01001000: PRA,
      0b01100110: DEC,
      0b01100101: INC
    };

    function LDI(operand_a, operand_b) {
      console.log("LDI operand_a", operand_a);
      this.reg[operand_a] = operand_b;
      console.log("reg", this.reg);
      this.pc += 3;
    }

    function PRN(operand_a, operand_b) {
      console.log(`${this.reg[operand_a]}`);
      this.pc += 2;
    }

    function PUSH(operand_a, operand_b) {
      this.reg[this.SP] -= 1;
      let reg_num = operand_a;
      let reg_val = this.reg[reg_num];
      this.ram[this.reg[this.SP]] = reg_val;
      this.pc += 2;
    }

    function POP(operand_a, operand_b) {
      let val = this.ram[this.reg[this.SP]];
      let reg_num = operand_a;
      this.reg[reg_num] = val;
      this.reg[this.SP] += 1;
      this.pc += 2;
    }

    function CALL(operand_a, operand_b) {
      let return_address = this.pc + 2;
      this.reg[this.SP] -= 1;
      this.ram[this.reg[this.SP]] = return_address;

      let reg_num = operand_a;
      this.pc = this.reg[reg_num];
    }

    function RET(operand_a, operand_b) {
      this.pc = this.ram[this.reg[this.SP]];
      this.reg[this.SP] += 1;
    }

    function JMP(operand_a, operand_b) {
      this.pc = this.reg[operand_a];
    }

    function JEQ(operand_a, operand_b) {
      let binary = parseInt(this.fl, 10).toString(2);
      if (binary[binary.length - 1] === "1") {
        JMP(operand_a, operand_b);
      } else {
        this.pc += 2;
      }
    }

    function JNE(operand_a, operand_b) {
      let binary = parseInt(this.fl, 10).toString(2);
      if (binary[binary.length - 1] === "0") {
        JMP(operand_a, operand_b);
      } else {
        this.pc += 2;
      }
    }

    // HERE

    function HLT(operand_a, operand_b) {
      this.running = false;
      this.pc += 1;
    }

    function MUL(operand_a, operand_b) {
      this.alu("MUL", operand_a, operand_b);
      this.pc += 3;
    }

    function ADD(operand_a, operand_b) {
      this.alu("ADD", operand_a, operand_b);
      this.pc += 3;
    }

    function SUB(operand_a, operand_b) {
      this.alu("SUB", operand_a, operand_b);
      this.pc += 3;
    }

    function CMP(operand_a, operand_b) {
      this.alu("CMP", operand_a, operand_b);
      this.pc += 3;
    }

    function AND(operand_a, operand_b) {
      this.alu("AND", operand_a, operand_b);
      this.pc += 3;
    }

    function OR(operand_a, operand_b) {
      this.alu("OR", operand_a, operand_b);
      this.pc += 3;
    }

    function XOR(operand_a, operand_b) {
      this.alu("XOR", operand_a, operand_b);
      this.pc += 3;
    }

    function NOT(operand_a, operand_b) {
      this.alu("NOT", operand_a, operand_b);
      this.pc += 2;
    }

    function SHL(operand_a, operand_b) {
      this.alu("SHL", operand_a, operand_b);
      this.pc += 3;
    }

    function SHR(operand_a, operand_b) {
      this.alu("SHR", operand_a, operand_b);
      this.pc += 3;
    }

    function MOD(operand_a, operand_b) {
      this.alu("MOD", operand_a, operand_b);
      this.pc += 3;
    }

    function PRA(operand_a, operand_b) {
      console.log("this hits");
      this.message += `${String.fromCharCode(this.reg[operand_a])}`;
      this.pc += 2;
    }

    function INC(operand_a, operand_b) {
      this.alu("INC", operand_a, operand_b);
      this.pc += 2;
    }

    function DEC(operand_a, operand_b) {
      this.alu("DEC", operand_a, operand_b);
      this.pc += 2;
    }
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

  //"""ALU operations.""
  alu(op, reg_a, reg_b) {
    const alu_opcodes = {
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

    function ADD(reg_a, reg_b) {
      this.reg[reg_a] += this.reg[reg_b];
    }

    function MUL(reg_a, reg_b) {
      this.reg[reg_a] *= this.reg[reg_b];
    }
    function SUB(reg_a, reg_b) {
      this.reg[reg_a] -= this.reg[reg_b];
    }
    function CMP(reg_a, reg_b) {
      let a = this.reg[reg_a];
      let b = this.reg[reg_b];
      let compared_value = a - b;
      if (compared_value > 0) {
        this.fl = 0b00000010;
      } else if (compared_value < 0) {
        this.fl = 0b00000100;
      } else if (compared_value === 0) {
        this.fl = 0b00000001;
      } else {
        this.fl = 0b00000000;
      }
    }
    function AND(reg_a, reg_b) {
      let a = this.reg[reg_a];
      let b = this.reg[reg_b];
      let and_result = a & b;
      this.reg[reg_a] = and_result;
    }
    function OR(reg_a, reg_b) {
      let a = this.reg[reg_a];
      let b = this.reg[reg_b];
      let or_result = a | b;
      this.reg[reg_a] = or_result;
    }
    function XOR(reg_a, reg_b) {
      let a = this.reg[reg_a];
      let b = this.reg[reg_b];
      let xor_result = a ^ b;
      this.reg[reg_a] = xor_result;
    }
    function NOT(reg_a, reg_b) {
      let a = this.reg[reg_a];
      let not_result = ~a;
      this.reg[reg_a] = not_result;
    }
    function SHL(reg_a, reg_b) {
      let a = this.reg[reg_a];
      let b = this.reg[reg_b];
      let shl_result = a << b;
      this.reg[reg_a] = shl_result;
    }
    function SHR(reg_a, reg_b) {
      let a = this.reg[reg_a];
      let b = this.reg[reg_b];
      let shr_result = a >> b;
      this.reg[reg_a] = shr_result;
    }
    function MOD(reg_a, reg_b) {
      let a = this.reg[reg_a];
      let b = this.reg[reg_b];
      if (b === 0) {
        this.running = false; // Halts the program
        return;
      }
      let mod_result = a % b;
      this.reg[reg_a] = mod_result;
    }

    //     # For CS BW 2
    function INC(reg_a, reg_b) {
      this.reg[reg_a] += 1;
    }
    function DEC(reg_a, reg_b) {
      this.reg[reg_a] -= 1;
    }

    let alu_op = alu_opcodes[op];

    if (alu_op) {
      alu_op(reg_a, reg_b);
    } else {
      return "Unsupported ALU operation";
    }
  } // end of ALU

  ram_read(mar) {
    return this.ram[mar];
  }
  ram_write(mar, mdr) {
    this.ram[mar] = mdr;
    return true;
  }

  run() {
    this.message = "";
    while (this.running) {
      let ir = this.ram_read(this.pc);
      let operand_a = this.ram_read(this.pc + 1);
      let operand_b = this.ram_read(this.pc + 2);
      //   console.log("ir", ir);
      //   console.log("operand_a", operand_a);
      //   console.log("operand_b", operand_b);
      console.log("ram", this.ram);

      console.log(this.opcodes, "opcode");
      let opcode = this.opcodes[ir];

      if (opcode) {
        // console.log("this works!?!?!");
        opcode(operand_a, operand_b);
      } else {
        console.log(`Unknown command: ${ir}`);
      }
    }
    return this.message;
  }
}

// let string =
//   "You see a faint pattern in the water...\n\n10000010\n00000001\n01001101\n01001000\n00000001\n10000010\n00000001\n01101001\n01001000\n00000001\n10000010\n00000001\n01101110\n01001000\n00000001\n10000010\n00000001\n01100101\n01001000\n00000001\n10000010\n00000001\n00100000\n01001000\n00000001\n10000010\n00000001\n01111001\n01001000\n00000001\n10000010\n00000001\n01101111\n01001000\n00000001\n10000010\n00000001\n01110101\n01001000\n00000001\n10000010\n00000001\n01110010\n01001000\n00000001\n10000010\n00000001\n00100000\n01001000\n00000001\n10000010\n00000001\n01100011\n01001000\n00000001\n10000010\n00000001\n01101111\n01001000\n00000001\n10000010\n00000001\n01101001\n01001000\n00000001\n10000010\n00000001\n01101110\n01001000\n00000001\n10000010\n00000001\n00100000\n01001000\n00000001\n10000010\n00000001\n01101001\n01001000\n00000001\n10000010\n00000001\n01101110\n01001000\n00000001\n10000010\n00000001\n00100000\n01001000\n00000001\n10000010\n00000001\n01110010\n01001000\n00000001\n10000010\n00000001\n01101111\n01001000\n00000001\n10000010\n00000001\n01101111\n01001000\n00000001\n10000010\n00000001\n01101101\n01001000\n00000001\n10000010\n00000001\n00100000\n01001000\n00000001\n10000010\n00000001\n10101111\n10000010\n00000010\n10110101\n10101000\n00000001\n00000010\n10000010\n00000010\n10010110\n10101011\n00000001\n00000010\n01001000\n00000001\n10000010\n00000001\n10101100\n10000010\n00000010\n11110001\n10101000\n00000001\n00000010\n10000010\n00000010\n10010111\n10101011\n00000001\n00000010\n01001000\n00000001\n10000010\n00000001\n11101011\n10000010\n00000010\n00100001\n10101000\n00000001\n00000010\n10000010\n00000010\n00010000\n10101011\n00000001\n00000010\n01001000\n00000001\n00000001";

// let cpu = new CPU();
// cpu.load(string);
// let run = cpu.run();
// console.log("message: ", run)
