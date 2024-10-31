"use client";
import Opinion from "./opinion/Opinion";
import Navbar from "./navbar/Navbar";
import {
  BackgroundSection,
  GlobalStyle,
  MainContent,
  NavbarOverlay,
} from "./background/background";
import { CardItem, CardContainer } from "./product_items/card_item";

export default function Home() {
  return (
    <div>
      <GlobalStyle />
      <NavbarOverlay>
        <Navbar />
      </NavbarOverlay>
      <BackgroundSection />
      <Opinion />
      <MainContent>
        <CardContainer>
          <CardItem
            imageUrl="/22.png"
            onBuyClick={() => alert("Buying product 2")}
            onOpinionClick={() => alert("Give opinion on product 2")}
          />
          <CardItem
            imageUrl="/11.png"
            onBuyClick={() => alert("Buying product 2")}
            onOpinionClick={() => alert("Give opinion on product 2")}
          />
          <CardItem
            imageUrl="/21.png"
            onBuyClick={() => alert("Buying product 3")}
            onOpinionClick={() => alert("Give opinion on product 3")}
          />
          <CardItem
            imageUrl="/25.png"
            onBuyClick={() => alert("Buying product 3")}
            onOpinionClick={() => alert("Give opinion on product 3")}
          />
          <CardItem
            imageUrl="/12.png"
            onBuyClick={() => alert("Buying product 3")}
            onOpinionClick={() => alert("Give opinion on product 3")}
          />
          <CardItem
            imageUrl="/24.png"
            onBuyClick={() => alert("Buying product 3")}
            onOpinionClick={() => alert("Give opinion on product 3")}
          />
        </CardContainer>
      </MainContent>
    </div>
  );
}
