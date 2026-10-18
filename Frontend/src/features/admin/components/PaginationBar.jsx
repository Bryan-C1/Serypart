import { ChevronLeft, ChevronRight, ChevronsLeft } from "lucide-react";

export function PaginationBar({
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  total,
  onPageChange,
  itemName = "registros",
}) {
  if (totalPages <= 1) {
    return (
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground">
          Mostrando {total === 0 ? 0 : startIndex + 1} - {Math.min(endIndex, total)} de {total} {itemName}
        </p>
        {currentPage > 1 && (
          <button
            onClick={() => onPageChange(1)}
            className="inline-flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm hover:bg-accent transition-colors"
          >
            <ChevronsLeft className="w-4 h-4" />
            Volver a la primera página
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between mt-6 pt-4 border-t border-border gap-4 flex-wrap">
      <p className="text-sm text-muted-foreground">
        Mostrando {total === 0 ? 0 : startIndex + 1} - {Math.min(endIndex, total)} de {total} {itemName}
      </p>

      <div className="flex items-center gap-2">
        {currentPage > 1 && (
          <button
            onClick={() => onPageChange(1)}
            className="inline-flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm hover:bg-accent transition-colors"
          >
            <ChevronsLeft className="w-4 h-4" />
            Primera página
          </button>
        )}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 border border-border rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Página anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            if (
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1)
            ) {
              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`min-w-[2.5rem] px-3 py-2 rounded-lg text-sm transition-colors ${
                    currentPage === page
                      ? "bg-primary text-primary-foreground"
                      : "border border-border hover:bg-accent"
                  }`}
                >
                  {page}
                </button>
              );
            }

            if (page === currentPage - 2 || page === currentPage + 2) {
              return <span key={page} className="px-2 text-muted-foreground">...</span>;
            }

            return null;
          })}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 border border-border rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Página siguiente"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
