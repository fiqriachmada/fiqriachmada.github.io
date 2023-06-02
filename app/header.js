// 'use client';

// import React from 'react';

// function Header() {
//   return (
//     <main>
//       <div className="text-white">Header</div>
//     </main>
//   );
// }

// export default Header;

'use client';

import { useState } from 'react';

export default function Header() {
  const [count, setCount] = useState(0);

  return (
    <main>
      <div>
        <p>You clicked {count} times</p>
        <button onClick={() => setCount(count + 1)}>Click me</button>
      </div>
    </main>
  );
}
