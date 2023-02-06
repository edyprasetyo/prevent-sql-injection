import { useState } from 'react';

export default function App() {
  const [showAlert, setShowAlert] = useState(false);

  function onPasteQuery() {
    setTimeout(() => {
      var query = (document.getElementById('txtQuery') as HTMLInputElement).value;
      (document.getElementById('txtResult') as HTMLInputElement).value = '';
      let input = query;
      let outputQuery = input.split('!!')[0];
      let outputParam = 'return ' + input.split('return')[1].trim();
      let outputParamItems = 'q';
      if (!input.includes('!!')) {
        alert('mohon tambah split dengan menambahkan !! di akhir query');
        return;
      }
      let paramsQuery = input.split('!!')[1].split(/\r?\n/);
      let i = 0;
      for (let o of paramsQuery) {
        if (o.trim() === '' || o.trim().includes('return')) {
          continue;
        }
        let param = o.replaceAll(' ', '');
        let containsPercent = false;
        if (o.includes("'{0}'")) {
          param = param
            .replaceAll('q=q.Replace("', '')
            .replaceAll('",string.Format("\'{0}\'"', '')
            .replaceAll('));', '')
            .trim();
        } else if (o.includes("'%{0}%'")) {
          param = param
            .replaceAll('q=q.Replace("', '')
            .replaceAll('",string.Format("\'%{0}%\'"', '')
            .replaceAll('));', '')
            .trim();
          containsPercent = true;
        } else if (o.includes('{0}')) {
          param = param
            .replaceAll('q=q.Replace("', '')
            .replaceAll('",string.Format("{0}"', '')
            .replaceAll('));', '')
            .trim();
        } else {
          param = param
            .replaceAll('q=q.Replace("', '')
            .replaceAll('",', ',')
            .replaceAll(');', '')
            .trim();
        }
        let paramSplit = param.split(',');
        outputQuery = outputQuery.replaceAll("'" + paramSplit[0].trim() + "'", '@' + i.toString());
        outputQuery = outputQuery.replaceAll(paramSplit[0].trim(), '@' + i.toString());
        outputParamItems +=
          '\r\n' +
          ',' +
          (!containsPercent
            ? paramSplit[1].trim()
            : 'string.Format("%{0}%", ' + paramSplit[1].trim() + ')');
        i++;
      }
      var output =
        outputQuery + '\r\n' + outputParam.replaceAll('(q)', '(' + outputParamItems + ')');
      navigator.clipboard.writeText(output);
      (document.getElementById('txtQuery') as HTMLInputElement).value = '';
      (document.getElementById('txtResult') as HTMLInputElement).value = output;
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 4000);
    }, 500);
  }

  return (
    <div className='w-full h-full flex flex-row relative'>
      <div
        className={
          'alert alert-success shadow-lg absolute top-0 right-0 w-[300px] ' +
          (showAlert ? 'block' : 'hidden')
        }
      >
        <div>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='stroke-current flex-shrink-0 h-6 w-6'
            fill='none'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <span>Copy Success</span>
        </div>
      </div>
      <div className='w-full h-full flex flex-row'>
        <div className='flex-1  px-[50px] py-[50px]'>
          <div className='mockup-code'>
            <pre>
              <code>Example Unparameterized Query</code>
            </pre>
            <pre>
              <code>string q = {'""'};</code>
            </pre>
            <pre>
              <code>q += {'"SELECT * FROM MSUSER a WHERE a.UserID = @UserID"'};</code>
            </pre>
            <pre>
              <code>!!</code>
            </pre>
            <pre>
              <code>q = {'q.Replace("@UserID", userID)'};</code>
            </pre>
            <pre>
              <code>return MdlDtl.RetrieveListDictionaryQuery(q);</code>
            </pre>
          </div>
          <textarea
            id='txtQuery'
            className='textarea bg-gray-600 w-full h-full mt-5'
            placeholder='Query'
            onPaste={() => {
              onPasteQuery();
            }}
          ></textarea>
        </div>
        <div className='flex-1  px-[50px] py-[50px]'>
          <div className='mockup-code'>
            <pre>
              <code>Example Parameterized Query</code>
            </pre>
            <pre>
              <code>string q = {'""'};</code>
            </pre>
            <pre>
              <code>q += {'"SELECT * FROM MSUSER a WHERE a.UserID = @0"'};</code>
            </pre>
            <pre>
              <code></code>
            </pre>
            <pre>
              <code>return MdlDtl.RetrieveListDictionaryQuery(q</code>
            </pre>
            <pre>
              <code>, userID);</code>
            </pre>
          </div>
          <textarea
            id='txtResult'
            className='textarea bg-gray-600 w-full h-full mt-5'
            placeholder='Parameterized'
          ></textarea>
        </div>
      </div>
    </div>
  );
}
