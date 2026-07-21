const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '..', 'supabase_credentials_backup.sql');
const outputFile = path.join(__dirname, '..', 'supabase_credentials_backup_clean.sql');

function splitSqlValues(valuesStr) {
  const parts = [];
  let current = '';
  let inQuote = false;
  for (let i = 0; i < valuesStr.length; i++) {
    const char = valuesStr[i];
    if (char === "'") {
      if (inQuote && valuesStr[i + 1] === "'") {
        current += "''";
        i++; // skip next quote
      } else {
        inQuote = !inQuote;
        current += char;
      }
    } else if (char === ',' && !inQuote) {
      parts.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  parts.push(current.trim());
  return parts;
}

const content = fs.readFileSync(inputFile, 'utf8');
const lines = content.split('\n');

const cleanedLines = lines.map((line, index) => {
  if (!line.trim().startsWith('INSERT INTO auth.users')) {
    return line;
  }

  // Find columns
  const colStart = line.indexOf('INSERT INTO auth.users (') + 'INSERT INTO auth.users ('.length;
  const colEnd = line.indexOf(') VALUES');
  const colsStr = line.substring(colStart, colEnd);
  const cols = colsStr.split(',').map(s => s.trim());

  // Find values
  const valStart = line.indexOf('VALUES (') + 'VALUES ('.length;
  const valEnd = line.lastIndexOf(') ON CONFLICT');
  const valsStr = line.substring(valStart, valEnd);
  const vals = splitSqlValues(valsStr);

  if (cols.length !== vals.length) {
    console.error(`Line ${index + 1}: Mismatch between columns (${cols.length}) and values (${vals.length})`);
    console.error(`Columns: ${colsStr}`);
    console.error(`Values: ${valsStr}`);
    process.exit(1);
  }

  // Find index of confirmed_at
  const targetCol = 'confirmed_at';
  const targetIdx = cols.indexOf(targetCol);

  if (targetIdx !== -1) {
    cols.splice(targetIdx, 1);
    vals.splice(targetIdx, 1);
  }

  // Handle ON CONFLICT
  const conflictStart = line.indexOf('ON CONFLICT (id) DO UPDATE SET') + 'ON CONFLICT (id) DO UPDATE SET'.length;
  // Ends with ; followed by optional whitespace/newline
  const conflictEnd = line.lastIndexOf(';');
  const conflictStr = line.substring(conflictStart, conflictEnd).trim();
  const assignments = splitSqlValues(conflictStr);

  const cleanedAssignments = assignments.filter(assignment => {
    const parts = assignment.split('=');
    const lhs = parts[0].trim();
    return lhs !== 'confirmed_at';
  });

  const reconstructed = `INSERT INTO auth.users (${cols.join(', ')}) VALUES (${vals.join(', ')}) ON CONFLICT (id) DO UPDATE SET ${cleanedAssignments.join(', ')};`;
  return reconstructed;
});

fs.writeFileSync(outputFile, cleanedLines.join('\n'), 'utf8');
console.log('Successfully cleaned sql file!');
