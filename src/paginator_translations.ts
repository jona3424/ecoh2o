import { MatPaginatorIntl } from "@angular/material/paginator";

const translations = new MatPaginatorIntl();
      
translations.itemsPerPageLabel = "Stavki po stranici:";
translations.nextPageLabel = "Sledeća stranica"
translations.previousPageLabel = "Prethodna stranica"
translations.getRangeLabel = (page, pageSize, length) => {
	if (length == 0 || pageSize == 0)
	return `0 od ${length}`;

	length = Math.max(length, 0);

	const startIndex = page * pageSize;
	const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;

	return `${startIndex + 1} - ${endIndex} od ${length}`;
};

export default translations;