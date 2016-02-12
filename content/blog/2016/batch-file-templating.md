+++
title = "Batch File Templating"
date = 2016-02-12T21:40:00Z
categories = ["Dev"]
tags = ["batch", "template"]
+++
Say you have a batch file and you want to read in a template and replace some values in it and output the result as a separate file.
<!--more-->
```bat
@echo off
setlocal enabledelayedexpansion

rem Reference to the template file and output
set template=my-template.txt
set outputFile=my-output.txt

rem Set template values
set name=Colin Bate
set url=http://colin.is

rem Read template and replace
for /f "tokens=1,* delims=¶" %%G in ( '"type %template%"') do (
  set _temp=%%G
  set _modified=!_temp:{{NAME}}=%name%!
  set _modified=!_modified:{{URL}}=%url%!
  echo !_modified! >> %outputFile%
)

endlocal
```

Great! So this will read `my-template.txt` and replace any occurrences of `{{NAME}}` with "Colin Bate" and `{{URL}}` with my URL. It will save that result of that to `my-output.txt`.

Note the use of `enabledelayedexpansion` at the top, this allows the evaluation of the variables using `!` inside the loop to work.

This works, but assume you are getting your name and url from somewhere else. And assume that the name you get on some run of this script is: "Pete (Maverick) Mitchell". What will you see?

```plain
Mitchell was unexpected at this time.
```

And while that might be true, it does cause a problem. The underlying issue is the parentheses in the name.

So what can you do about it, short of flying off without your wingman?

Add the following to your script after you read in the name and before you loop through the template.

```bat
set name=!name:)=^^)!
```

What looks like an emoticon with two noses is actually another variable replacement escaping your closing parenthesis. Escaping values in variables is a tricky business as your escape characters can be consumed when used with `%` based expansion.

If you want to preserve any `^` characters that might be in your input, add this as well.

```bat
set name=!name:^^=^^^^!
```

Good luck!