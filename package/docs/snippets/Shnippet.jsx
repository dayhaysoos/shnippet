import { MyJSXSnippet } from 'Test.jsx';
// export const Shnippet = async ({ snippetName }) => {
//   const snippet = await snippetManager.getSnippet(snippetName);

//   console.log(snippet);

//   return snippet;
// };

export const Shnippet = () => {
  return (
    <div>
      Test <MyJSXSnippet />
    </div>
  );
};
