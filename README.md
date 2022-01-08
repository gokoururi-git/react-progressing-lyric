a expandable react components for displaying karaoke styled lyrics

## usage

```tsx
import { Karaoke } from 'react-progress-lyric';

function test(){
  return (
    <Karaoke
      xlrc={xlrcString}
      className={className}
    />
  );
}
```

## what is `.xlrc`?

`.xlrc` is an extended version for `.lrc` file personally defined. in this component, we must give a xlrc string to ass prop, or it will work abnormally.

## why not `.lrc`?

it's no need to say that the `.lrc` file give us a simple standard to describe a song's lyric, but when there is a karaoke lyric, `.lrc` cannot give the time for every single word any more, that's why `.xlrc` appeared.

## how can I get this fuck .xlrc?

oh, guys. don't worry, you just need `npm run ass2xlrc <file>.ass`, then you will get xlrc based on .ass file. but you need to prepared a .ass file.

the more message for .ass is [here](http://www.aegisub.org/)