Bike
====

A little app for helping with bike sizes.

[ ![Codeship Status for OrganicPanda/Bike](https://codeship.com/projects/2b7b1ad0-0a70-0132-783b-7affebf0af3d/status)](https://codeship.com/projects/31767)

## TODO (Meta TODO: Move these to GH Issues)

### Add Caveat
 - Work out how big the margin for error currently is
 - State that somewhere
 - Warn users

### Rate bike fit
 - Research a few acceptable measures of bike fit

### Offer quick rider size toggles
 - Adult/Child (Maybe an age slider?)
 - Male/Female (Probably not a slider!)

### Different Bike types
 - Road 
 - MTB
 - Do women's bikes need their own category? Are they are different enough?
 - Handlebar types (Straight, dutch, drop, tri)

### Different rider positions
 - Standing (pedalling)
 - Standing (stopped, over top tube)
 - Stopped at the lights (bum on saddle, tip toe on floor)
 - Elbows bent

### Supply a list of default bikes
 - Scrape sizes to begin with
 - Find a good source of more accurate information (those catalogues in bike shops might be available online somewhere)
 - Store that somewhere
 - Provide an API 

### Give a bike recommendation? 
 - Link to buy?

### Bugs/Misc
 - Fix saddle positioning
 - Add hands and feet
 - Work out a way to use top tube length instead of reach/stack (Charge) or way a way to estimate reach/stack
 - Work out head position/size
 - Fork length: http://www.sheldonbrown.com/rinard/forklengths.htm It's not clear whether the angles given in a bike spec assume (They never say which method they used although (A) seems likely):
     + A) The box described by Bottom Bracket Drop and Chain Stay Length is parallel to the ground. This is the method I'm using.
     + B) The fork length the bike is sold with
     + C) A default fork length
 - Wheel / Tyre:
     + Tyre inch size tells us (total height x tyre height x tyre width) (28 x 1 5/8 x 1 1/4)
     + That tells us total height (28in): 711.2mm
     + We know rim size (700c): 622mm
     + So tyre height is ((711.2mm - 622mm) / 2): 44.6
     + 44.6mm doesn't match 1 5/8 (41.27500mm) and I'm not sure why!?
     + My tyres are ~25mm (28-622) and my wife's are ~30mm (32-622)
     + Might as well just use that number?
     + Going for 700c-28c for now (622mm + 28mm + 28mm): 678mm
 - Saddle height (adjustable but not sure what a 'normal' range is)
 - Headset length
 - Stem angle
 - Pan/zoom
 - Size overlays / blueprint mode

## Useful links:
### Size Guides
[Giant Size recommendations](http://www.giant-bicycles.com/_upload_uk/bikes/series/sizingsheets/ENVIE_ADV_SIZING.jpg)
[Specialized Manual](http://static.specialized.com/media/docs/support/0000023116/0000023116_ENG_AS_NZS_R1.pdf)
[Wiggle](http://www.wiggle.co.uk/h/option/bikesizeguide)
[Evans](http://www.evanscycles.com/help/bike-sizing)
[ebicycles](http://www.ebicycles.com/bicycle-tools/frame-sizer/road-bike/size-sheet?utf8=%E2%9C%93&u=in&r=man&h=1752.6&i=787.4&b=Calculate)
[Raleigh](http://www.raleigh.co.uk/Support/BikeSizeGuide/)
[Edinburghbicycle](http://www.edinburghbicycle.com/info/bike-sizing-guide/)

### Brand geometry pages
[Giant](http://www.giant-bicycles.com/en-gb/bikes/model/envie.advanced.1/19195/77370/#geometry) (minimal details)
[Specialized](http://www.specialized.com/gb/gb/bikes/road/tarmac/tarmac-pro-disc-race-udi2#geometry) (detailed)
[Boardman](http://www.boardmanbikes.com/road/air98.html) (detailed)
[Charge](http://www.chargebikes.com/plug/plug-3) (very detailed)